* [x] commonize screen size sharing
* [x] dark mode within material ui?
* [x] color blind mode
* [x] color blind share icon colors
* [x] figure out passing "theme" styling throughout
* [x] unit tests for utils.js
* [x] add data labels to distribution
* [x] change color of number of the distribution that you just solved
* [x] keep generateDateArray? No
* [x] add share icons to won dialog
* [x] allow user to close Won Dialog?
* [x] play "next" unsolved puzzle in Won Dialog
* [x] what does Won Dialog show when you've already played this puzzle before?
* [x] bugfix: update distribution after delete
* [x] buttons to copy shareable icons
* [x] give info somewhere on total solved and total remaining --> something like a stats page
* [x] allow deleting of history in table, and delete all history
* [x] filter history table
* [x] add Autocomplete for selecting by puzzle number
* [x] move focus to guesses board after closing / clicking anything in the input bar above guesses board
* [x] convert calendar and puzzle num inputs to Dialogs (so that they can't both be open at same time)
* [x] better handle what specific key presses will exit you from puzzle num selector dialog
* [x] some indication or button that have to press "enter"/"return" to submit puzzle num on mobile -- perhaps a submit button is easiest?
* [x] move focus to puzzle num selector text field initially
* [x] guess possible words
* [x] guess suggestions
* [x] give option to turn on Hard Mode (instead of accepting all valid word guesses, only those of the filtered suggestions)
* [x] add hard mode localStorage to save state
* [x] fix bug when pressing ENTER to close Possible Words Dialog it auto opens again -- done via blur
* [x] (probably unneeded now that each guess is saved) show some sort of warning dialog when game is in progress but you're about to navigate away to another local page
* [x] tidy suggestions button ref and general naming (vs possible words and possible guesses)
* [x] tidy stats page styling
  * [x] explanations for each section
  * [x] update coloring of distribution bars
  * [x] make better title for distribution chart
  * [x] more details when hovering over a distribution bars as to what it means
  * [x] have history table match background color when in dark mode
* [x] bugfix: don't exit Calendar on year change
* [x] show previous guesses on solved puzzles
* [x] show which are solved on Date Picker
* [x] add tooltips to game inputs
* [x] allow query param by puzzle number
* [x] move game inputs to App bar
  * [x] especially the settings
  * [x] other inputs
  * [x] tidy title and other elements of nav bar
* [x] bugfix: won dialog highlighting the one higher guess number
* [x] populate additional pages in App bar
  * [x] About
  * [x] News (Blog)
  * [x] Feedback
  * [x] Donate
* [x] brighter links in markdown when on dark mode (solved thanks to this documentation on [react-markdown components](https://github.com/remarkjs/react-markdown#appendix-b-components))
* [x] simple version of News blog
* [x] add Badge when there's new News
* [x] remove placeholder LOGO from App bar
* [x] render additional pages as markdown
* [x] bugfix: if nav from a solved puzzle to not-started then back to solved, guesses don't show up (due to lastLoadedDate not changing)
* [x] bugfix: nav links in hamburger too dark when in dark mode -- figure out how to better use MUI Typography styling here rather than react-router-dom
* [x] save state on partially finished puzzles
* [x] prevent having to push "enter" to resume puzzle play on unfinished puzzles?
* [x] show correct keyboard colors when resuming puzzle
* [x] publish to GitHub pages
* [x] bugfix: after clicking "Play Next" button, you can see the next solution briefly
* [x] add "<" and ">" buttons to play prev and next unsolved
* [x] bugfix: Set.union not working on some browsers -- use custom `union` function
* [x] make sure really fits on phone screen
* [x] add favicon and other metadata
* [x] Google Analytics
* [ ] test on windows laptop (particularly if "Enter" and "Escape" keys are same as expected)
* [x] test on android phone
* [ ] add more details to feedback form
* [x] add "OK" button to Won Dialog (otherwise not obvious how to close)
* [x] add local storage keys to constants
* [ ] transition to wordlereplay.com (including in package.json, share link)

Before post:
* [ ] update metadata
  * [ ] logo
  * [ ] description
* [ ] clean out unused code files
* [ ] update React tests for App.js
* [ ] update README
  * [ ] steps on how to add new News post
  * [ ] steps on how to add a new page


For later
* [ ] animate UI keyboard when typing on a physical keyboard
* [ ] animate tile flips
* [ ] mechanism to save history
* [ ] mechanism to import history
* [ ] allow user to get back to Won dialog beyond pressing "ENTER"
* [ ] open Feedback and Donate links in new tab
* [ ] fix error showing up due to distribution chart throwing an error with bar labels (not [Custom Labels](https://mui.com/x/react-charts/bars/#custom-labels) doesn't do this)
* [ ] allow autofocus on buttons within dialogs (there was a bug in production build when pressing ENTER on guesses board)
* [ ] custom wordle?
* [ ] figure out how to change focus back to guesses board after changing, say, dark mode and then exiting settings menu or editing history in stats dialog
* [ ] allow user to decide if they want to see previous guesses OR replay without seeing
* [x] archive 
  * [x] DateSelector
  * [x] SearchBar
  * [x] IFrame
  * [x] FeedbackPage, DonatePage
* [ ] delete archive?
* [x] avoid hardcoding 'white' in ResponsiveAppBar
* [ ] convert 'YYYY-MM-DD' to constant variable throughout
* [x] improve guess suggestions
* [ ] update manifest
* [ ] if change date on calendar, say, but currently on the About page, make sure to change page to the game board
* [x] make news badge more visible
* [ ] make common component using mui Link via react-router-dom Link
* [ ] AWS dynamoDB?
* [ ] update "auto update" script (if needed) to include the "export" at the beginning of file