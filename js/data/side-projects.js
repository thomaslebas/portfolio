// Side quests are markdown files in content/side-projects/, fetched and
// parsed at page-load time by js/project-content.js. Adding { slug: '...' }
// here registers a new side quest file with the site — everything else about
// its content lives entirely in the .md file. Editing an existing side quest
// never requires touching this file.
const sideProjects = [
  { slug: 'sad-boy' },
  { slug: 'sherlock' },
  { slug: 'human-slop' },
  
  { slug: 'lookback' },
  { slug: 'yeah-nah-maybe' },
  { slug: 'pokemon-fieldbook' }

];
