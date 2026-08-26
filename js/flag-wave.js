(function () {
  'use strict';

  if (!navigator.gpu) return;

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotionQuery.matches) return;

  var heading = document.querySelector('.home-intro');
  if (!heading) return;

  var textNode = null;
  for (var i = 0; i < heading.childNodes.length; i++) {
    var node = heading.childNodes[i];
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      textNode = node;
      break;
    }
  }
  if (!textNode) return;

  var fullText = textNode.textContent;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  var flagCanvas = document.createElement('canvas');
  flagCanvas.setAttribute('aria-hidden', 'true');

  var textCanvas = document.createElement('canvas');
  var textCtx = textCanvas.getContext('2d');

  var device = null;
  var gpuContext = null;
  var format = null;
  var pipeline = null;
  var sampler = null;
  var uniformBuffer = null;
  var bindGroup = null;
  var texture = null;
  var amplitude = 0.02;
  var startTime = null;
  var rafId = null;
  var running = false;
  var destroyed = false;
  var resizeTimeout = null;

  // The text is treated like a flag pinned at its left edge: displacement
  // grows with horizontal distance from that edge, and a traveling sine
  // wave along x drives both vertical and (lighter) horizontal sway, so
  // it reads as cloth rippling in wind rather than water rippling outward
  // from a point.
  var shaderCode = [
    'struct VertexOutput {',
    '  @builtin(position) position: vec4<f32>,',
    '  @location(0) uv: vec2<f32>,',
    '};',
    '',
    '@vertex',
    'fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {',
    '  var pos = array<vec2<f32>, 3>(',
    '    vec2<f32>(-1.0, -1.0),',
    '    vec2<f32>(3.0, -1.0),',
    '    vec2<f32>(-1.0, 3.0)',
    '  );',
    '  var out: VertexOutput;',
    '  let p = pos[vertexIndex];',
    '  out.position = vec4<f32>(p, 0.0, 1.0);',
    '  out.uv = vec2<f32>((p.x + 1.0) * 0.5, 1.0 - (p.y + 1.0) * 0.5);',
    '  return out;',
    '}',
    '',
    'struct Uniforms {',
    '  time: f32,',
    '  amplitude: f32,',
    '  padding0: f32,',
    '  padding1: f32,',
    '};',
    '',
    '@group(0) @binding(0) var<uniform> uniforms: Uniforms;',
    '@group(0) @binding(1) var textTexture: texture_2d<f32>;',
    '@group(0) @binding(2) var textSampler: sampler;',
    '',
    '@fragment',
    'fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {',
    '  let growth: f32 = smoothstep(0.0, 1.0, uv.x);',
    '  let phase: f32 = uv.x * 10.0 - uniforms.time * 2.0;',
    '  let waveY: f32 = sin(phase) * growth * uniforms.amplitude;',
    '  let waveX: f32 = cos(phase) * growth * uniforms.amplitude * 0.35;',
    '  let dispUV: vec2<f32> = uv + vec2<f32>(waveX, waveY);',
    '  let baseSample = textureSample(textTexture, textSampler, dispUV);',
    '',
    '  return vec4<f32>(baseSample.rgb * baseSample.a, baseSample.a);',
    '}'
  ].join('\n');

  function getTextColor() {
    var value = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
    return value ? value.trim() : '#111111';
  }

  // Word-level Range rects give us the browser's real line-wrap positions,
  // so the captured texture always matches actual CSS layout at any width.
  function computeWordRects() {
    var words = [];
    var re = /\S+/g;
    var match;
    while ((match = re.exec(fullText))) {
      words.push({ text: match[0], start: match.index, end: match.index + match[0].length });
    }

    var headingRect = heading.getBoundingClientRect();
    var results = [];

    words.forEach(function (word) {
      var range = document.createRange();
      range.setStart(textNode, word.start);
      range.setEnd(textNode, word.end);
      var rects = range.getClientRects();
      if (!rects.length) return;
      var rect = rects[0];
      results.push({
        text: word.text,
        x: rect.left - headingRect.left,
        y: rect.top - headingRect.top
      });
    });

    return results;
  }

  // The wave nudges glyphs sideways and up/down, so a canvas sized to fit
  // the text exactly would clip whatever swings past its edges (most
  // visible on the last, right-most words, which sway the most). Padding
  // the capture area on all sides gives that motion room to breathe.
  var PADDING_RATIO = 0.08;

  function drawTextTexture() {
    var width = Math.max(1, Math.round(heading.clientWidth));
    var height = Math.max(1, Math.round(heading.clientHeight));
    var padX = Math.ceil(width * PADDING_RATIO);
    var padY = Math.ceil(height * PADDING_RATIO);
    var totalWidth = width + padX * 2;
    var totalHeight = height + padY * 2;

    textCanvas.width = Math.round(totalWidth * dpr);
    textCanvas.height = Math.round(totalHeight * dpr);
    textCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    textCtx.clearRect(0, 0, totalWidth, totalHeight);

    var computed = getComputedStyle(heading);
    textCtx.font = computed.fontWeight + ' ' + computed.fontSize + ' ' + computed.fontFamily;
    textCtx.fillStyle = getTextColor();
    textCtx.textBaseline = 'top';

    computeWordRects().forEach(function (word) {
      textCtx.fillText(word.text, word.x + padX, word.y + padY);
    });

    return { width: width, height: height, padX: padX, padY: padY, totalWidth: totalWidth, totalHeight: totalHeight };
  }

  function createTextureFromCanvas() {
    if (texture) texture.destroy();
    texture = device.createTexture({
      size: [textCanvas.width, textCanvas.height, 1],
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    device.queue.copyExternalImageToTexture(
      { source: textCanvas },
      { texture: texture },
      [textCanvas.width, textCanvas.height]
    );
  }

  function updateTextureFromCanvas() {
    device.queue.copyExternalImageToTexture(
      { source: textCanvas },
      { texture: texture },
      [textCanvas.width, textCanvas.height]
    );
  }

  function createBindGroup() {
    bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } },
        { binding: 1, resource: texture.createView() },
        { binding: 2, resource: sampler }
      ]
    });
  }

  function resize() {
    var dims = drawTextTexture();
    flagCanvas.style.left = (-dims.padX) + 'px';
    flagCanvas.style.top = (-dims.padY) + 'px';
    flagCanvas.style.width = dims.totalWidth + 'px';
    flagCanvas.style.height = dims.totalHeight + 'px';
    flagCanvas.width = Math.round(dims.totalWidth * dpr);
    flagCanvas.height = Math.round(dims.totalHeight * dpr);
    createTextureFromCanvas();
    createBindGroup();
  }

  function scheduleResize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 120);
  }

  function refreshTextOnly() {
    drawTextTexture();
    updateTextureFromCanvas();
  }

  function frame(now) {
    if (destroyed) return;
    if (startTime === null) startTime = now;
    var t = (now - startTime) / 1000;

    device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([t, amplitude, 0, 0]));

    var encoder = device.createCommandEncoder();
    var view = gpuContext.getCurrentTexture().createView();
    var pass = encoder.beginRenderPass({
      colorAttachments: [{
        view: view,
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        loadOp: 'clear',
        storeOp: 'store'
      }]
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.draw(3);
    pass.end();
    device.queue.submit([encoder.finish()]);

    if (!running) {
      running = true;
      heading.appendChild(flagCanvas);
      requestAnimationFrame(function () {
        heading.classList.add('has-flag-wave');
      });
    }

    rafId = requestAnimationFrame(frame);
  }

  function startLoop() {
    if (rafId || destroyed) return;
    startTime = null;
    rafId = requestAnimationFrame(frame);
  }

  function stopLoop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function init() {
    navigator.gpu.requestAdapter().then(function (adapter) {
      if (!adapter || destroyed) return null;
      return adapter.requestDevice();
    }).then(function (dev) {
      if (!dev || destroyed) return;
      device = dev;
      format = navigator.gpu.getPreferredCanvasFormat();

      gpuContext = flagCanvas.getContext('webgpu');
      if (!gpuContext) return;
      gpuContext.configure({ device: device, format: format, alphaMode: 'premultiplied' });

      var shaderModule = device.createShaderModule({ code: shaderCode });
      pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: { module: shaderModule, entryPoint: 'vs_main' },
        fragment: {
          module: shaderModule,
          entryPoint: 'fs_main',
          targets: [{
            format: format,
            blend: {
              color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' },
              alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' }
            }
          }]
        },
        primitive: { topology: 'triangle-list' }
      });

      sampler = device.createSampler({
        magFilter: 'linear',
        minFilter: 'linear',
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge'
      });

      uniformBuffer = device.createBuffer({
        size: 16,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });

      resize();
      startLoop();

      var ro = new ResizeObserver(function () {
        scheduleResize();
      });
      ro.observe(heading);

      var darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addEventListener('change', refreshTextOnly);

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          stopLoop();
        } else {
          startLoop();
        }
      });

      reduceMotionQuery.addEventListener('change', function (e) {
        if (e.matches) {
          destroyed = true;
          stopLoop();
          heading.classList.remove('has-flag-wave');
          if (flagCanvas.parentNode) flagCanvas.parentNode.removeChild(flagCanvas);
        }
      });
    }).catch(function () {
      // WebGPU unavailable or failed to initialize; the static text stays as-is.
    });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    init();
  }
})();
