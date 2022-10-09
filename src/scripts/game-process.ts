
import { StoryRenderer } from "./page_exploration/scripts/StoryRenderer.js" 
import { prepareStoryInstance } from "./page_exploration/scripts/application_actions.js"

//Set up story renderer.//

//The story file to read.
const storyFileName = "labyrinth"
const storyTitle = "keeper-of-the-labyrinth"
const existingRootNode = "intro";

//Read the story from file, setup the renderer, and render the root node for the reader.
const labyrinthStory = prepareStoryInstance(storyFileName, existingRootNode);
const labyrinthStoryRenderer = new StoryRenderer(labyrinthStory, storyTitle);

//const globalGameState = new GameStateManager()

/**
 * Events:
 *      onNodeEnter
 *      onPrintText
 *      onPrintOptions
 *      onNodeExit
 * 
 *      onMenuOpen
 *      onMenuClose
 *      
 *      
*/

/**
 * "Core functionality"
 * 
 * Story progression:
 *      Handled by StoryRenderer.
 *      Emit events for everything else to hook onto.
 *      Update visited state tracking
 * 
 * Button creation:
 *      Create button frames for custom buttons
 *      Create hover/active listeners and reappend images
 * 
 * Popups:
 *      Load save message
 *      Content warnings
 * 
 * Images:
 *      Printing
 *      Clearing
 *      For main + shadow
 * 
 * Cursor events:
 *      Image parallax
 *          Main Menu
 *          Story images
 *      Custom cursor
 * 
 * Main menu:
 *      enter => check savegame, start
 *      map => show map
 *      options => show options
 *      credits => show credits
 *      quit => save, close window
 * 
 * Ingame menu:
 *      continue => hide menu
 *      journal => show journal
 *      options => show options
 *      quit => save, show main menu
 * 
 * Overlays: 
 *      Options
 *      Credits
 *      Map
 *      Journal
 *      Loading
 *      Font-license
 *      Font-license-2
 *      Gallery
 *      Gallery-Inspector
 * 
 * Options:
 *      Read form / Form listeners
 *      Set globally available object
 *      Save chenges to disk
 * 
 *      Text Size
 *      Music + Volume
 *      Animations
 *          Image Parallax
 *          Text Fade
 *      Content Warnings
 * 
 * Loading:
 *      Timed animation 
 *      Runs before main menu shown
 * 
 * Journal:
 *      Compiled StoryNode content based on visited
 *      Table of contents allowing traversal to element IDs
 * 
 * Gallery:
 *      Dynamically populate w/ images
 *      Shown / hidden state tracking
 *      Unlocks based on visited
 *      Inspector for gallery content + big image
 * 
 * Map:
 *      Printing handled by GridRenderer.
 *      Node hover => data popup
 *      Node click => open inspector if unlocked
 *      Analyze union of saves to determine unlocks 
 *      Start game from unlocked node
 *      View saved game paths
 *      Zoom buttons
 *      Breakdown per area ?
*/