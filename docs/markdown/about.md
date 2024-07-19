## Summary

The original [Wordle](https://en.wikipedia.org/wiki/Wordle) game only allows you to play the _current_ day's puzzle. If you missed yesterday's puzzle, you can't go back and play it again.

This site, WordleReplay.com, solves that problem and allows you to replay _any_ Wordle that's been published to date, from the very first on June 19, 2021 through today. This site also provides suggestions for your next guess, in case you get stuck and don't want to be thinking about your next guess all day.

WordleReplay.com was originally created by Doug Issichopoulos in late January 2022. It was substantially updated and converted to a [React app](https://react.dev/) in late May 2024. For more information about Doug, see his webpage at [dougissi.com](https://www.dougissi.com).


## How to Play

In all likelihood, you already know the rules of Wordle, but if not, you can reference the [Wordle Wikipedia page](https://en.wikipedia.org/wiki/Wordle).

The home page (WordleReplay.com) is where all games are played, and if you navigate to any other page on the site (like this one), you can return to the game by clicking the "Play" link from the navigation menu. Any guesses you've submitted for a puzzle will be saved, so you don't have to worry about accidentally closing your tab in the middle of a game. See below for more details on history.


## Playing Previous Puzzles

When you first navigate to WordleReplay.com, you will arrive at today's puzzle. If your tab stays open overnight, you will likely need to refresh the page at the start of the day to see the new day's puzzle appear.

If you've already played today's puzzle, there are several ways to play previous puzzles:
* Navigation Bar:
  * Click the `<` button to play the most recent unsolved puzzle _before_ the current puzzle
  * Click the puzzle number (e.g., `#1081`) and enter a new puzzle number in text box
  * Click the puzzle date (e.g., `2024-06-03`) and select a new date from the calendar pop up
  * Click the `>` button to play the most recent unsolved puzzle _after_ the current puzzle
* URL Parameters (useful for sharing particular puzzles with friends):
  * include the date in the URL: `https://wordlereplay.com/`**`?date=2024-06-03`**
  * include the puzzle number in the URL: `https://wordlereplay.com/`**`?num=1081`**
* History Table:
  * After clicking the Stats & History button in the top right corner, there is a History Table at the bottom of the popup window. You can click the date of any puzzle in the table to play it.
  * See below for more details on history


## History

Every time you enter a guess, it is saved in your browser's [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) storage, so you don't have to worry about accidentally closing your tab in the middle of a game.

When you navigate to a puzzle that you've either solved or have left unfinished, your previous guesses will be automatically loaded.

Viewing your history:
* If you click the Calendar button in the top right corner, you can view which dates are solved, unfinished, and still to do.
* If you click the Stats & History button in the top right corner, you can view your history the table at the bottom.
  * You can also **filter** this tableby the value of any column. For example, you can filter to just see the rows where the `Status` column is `Solved`, or you can filter to just see the rows where the `Guesses` column is `7+`.
  * If you click the check box next to one or more row, a **delete** button will appear in the top right of the table, and clicking that delete button will remove the selected rows from your history. Note: if you click the select box in the header of the table, you can select all rows of the table and delete your entire history.


## Settings

Clicking the Gear Icon in the top right corner will open a Settings menu. Any selection you make will be preserved going forward, regardless of whether you close the browser tab or navigate to another page.

* Enabling **Hard Mode** will only allow you to enter guesses that satisfy all the the insights you've gained from your previous guesses. For example, if your first guess shows a green "A" at the start of the word, all of the your future guesses must also start with "A". Similarly, if a guess reveals a yellow "T" at the end of the word, all of your future guesses cannot end with "T" but most have a "T" somewhere else in the word.
* Enabling **Dark Mode** will intelligently transition the site to a predominantly dark theme.
* Enabling **Color Blind Mode** will make the colors of the letters in the grid and the keyboard more distinguishable. I, Doug, am red-green color deficient, so while I haven't had trouble with the original Wordle colors, I'm thankful to be able to help others who have this challenge.
* Enabling **Suggestions Visible** will display the top suggested guesses beneath the keyboard _and keep them there_. See the Suggestions section below for another method of revealing the top suggested guesses without them always being visible.


## Suggestions

Click the question mark icon in the navigation bar at any point during your game to get WordleReplay.com's top suggestions for your next guess, as well as the list of all possible words you could enter that are consistent with your previous guesses (i.e., these are all the possible words you could enter when playing on Hard Mode).

Clicking any of those top suggestion buttons will submit that guess for you.


## News and Updates

You'll see a notification badge appear in the navigation bar when there is a new post on the News page, which will describe any new features or updates to the site.


## Contributing

If you have feedback for how to make the site better, please fill out our [feedback form](https://docs.google.com/forms/d/e/1FAIpQLSfKeTZCnnicWaVnn0PpGWvUjZvjrXeA7rx1wZUKCNnJJbIthA/viewform?usp=sf_link).

If you're familiar with React web development and you'd like to contribute to the site, see the [GitHub respository](https://github.com/dougissi/wordle-replay-react).


## Donating

For multiple years I've been building and maintaining this site for the benefit of you and thousands of others. If you'd like to show your appreciation, you can donate to me via [PayPal](https://www.paypal.com/donate/?hosted_button_id=JWHYPBKUV6FQE).

When you request new features, I'm especially motivated to help if you donate, but it's absolutely not a requirement.
