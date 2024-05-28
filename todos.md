* [x] commonize screen size sharing
* [x] dark mode within material ui?
* [x] color blind mode
* [x] color blind share icon colors
* [x] figure out passing "theme" styling throughout
* [ ] animate UI keyboard when typing on a physical keyboard
* [ ] animate tile flips
* [x] unit tests for utils.js
* [ ] update React tests for App.js
* [ ] prevent selecting text on keyboard (especially on mobile)
* [x] add data labels to distribution
* [x] change color of number of the distribution that you just solved
* [x] keep generateDateArray? No
* [x] add share icons to won dialog
* [x] allow user to close Won Dialog?
* [ ] play "next" unsolved puzzle in Won Dialog
* [ ] allow user to get back to Won dialog beyond pressing "ENTER"
* [ ] what does Won Dialog show when you've already played this puzzle before?
* [x] bugfix: update distribution after delete
* [x] buttons to copy shareable icons
* [x] give info somewhere on total solved and total remaining --> something like a stats page
* [x] allow deleting of history in table, and delete all history
* [ ] mechanism to save history
* [x] filter history table
* [ ] tidy stats page styling
* [x] add Autocomplete for selecting by puzzle number
* [ ] move focus to guesses board after closing / clicking anything in the input bar above guesses board
* [x] guess possible words
* [ ] guess suggestions
* [x] give option to turn on Hard Mode (instead of accepting all valid word guesses, only those of the filtered suggestions)
* [x] add hard mode localStorage to save state
* [x] fix bug when pressing ENTER to close Possible Words Dialog it auto opens again -- done via blur
* [x] (probably unneeded now that each guess is saved) show some sort of warning dialog when game is in progress but you're about to navigate away to another local page
* [ ] tidy suggestions button ref and general naming (vs possible words and possible guesses)
* [x] show previous guesses on solved puzzles
* [x] show which are solved on Date Picker
* [x] add tooltips to game inputs
* [ ] allow query param by puzzle number
* [ ] move game inputs to App bar
* [ ] populate additional pages in App bar
* [ ] remove placeholder LOGO from App bar
* [ ] allow user to decide if they want to see previous guesses OR replay without seeing
* [x] render additional pages as markdown
* [x] bugfix: if nav from a solved puzzle to not-started then back to solved, guesses don't show up (due to lastLoadedDate not changing)
* [x] bugfix: nav links in hamburger too dark when in dark mode -- figure out how to better use MUI Typography styling here rather than react-router-dom
* [x] save state on partially finished puzzles
* [x] prevent having to push "enter" to resume puzzle play on unfinished puzzles?
* [x] show correct keyboard colors when resuming puzzle
* [x] publish to GitHub pages
* [ ] add favicon and other metadata
* [ ] update README
* [ ] transition to wordlereplay.com (including in package.json)

Instructions:
* how to delete history (including all)
* how to use URL query/search params (date take precedence)

For later
* [ ] fix error showing up due to distribution chart throwing an error with bar labels (not [Custom Labels](https://mui.com/x/react-charts/bars/#custom-labels) doesn't do this)
* [ ] allow autofocus on buttons within dialogs (there was a bug in production build when pressing ENTER on guesses board)
* [ ] custom wordle?