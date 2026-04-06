# Wordle Replay React

**Live Site:** [wordlereplay.com](https://wordlereplay.com)

A fully client-side web application that allows users to replay any published [Wordle](https://en.wikipedia.org/wiki/Wordle) puzzle on demand, with intelligent hint suggestions when stuck.

## Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Core Game Logic](#core-game-logic)
- [State Management](#state-management)
- [Data Storage](#data-storage)
- [Theming](#theming)
- [Local Development](#local-development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Word List Updates](#word-list-updates)
- [Adding News Posts](#adding-news-posts)
- [Analytics](#analytics)
- [Known Limitations](#known-limitations)
- [Maintenance Requirements](#maintenance-requirements)
- [Cost Structure](#cost-structure)
- [History](#history)

## Key Features

**Gameplay:**
- Play any past Wordle puzzle by date or puzzle number
- Unlimited guesses (standard Wordle allows 6)
- Hard mode (enforces using revealed hints in subsequent guesses)
- Top 10 hint suggestions based on letter frequency analysis
- Auto-save and resume incomplete games

**User Interface:**
- Dark mode and light mode themes
- Colorblind mode (orange/blue palette)
- Calendar date picker for puzzle selection
- Puzzle number search with autocomplete
- Navigation buttons for finding unsolved puzzles
- Responsive mobile design

**Statistics & History:**
- Guess distribution chart
- Full puzzle history table (paginated)
- Solved/unfinished/to-do breakdown
- Share results via native share API or clipboard

**Content:**
- Markdown-based news/blog system
- Badge notifications for unread posts

## Technology Stack

**Frontend:**
- React 18.2.0
- React Router DOM 6.23.1 (client-side routing)
- Material-UI (MUI) 5.x (component library)
  - @mui/material, @mui/icons-material
  - @mui/x-charts (distribution charts)
  - @mui/x-date-pickers (calendar)
- Emotion 11.x (CSS-in-JS, required by MUI)
- Day.js 1.11.11 (date handling)
- React-Markdown 9.0.1 (news post rendering)

**Build & Tooling:**
- Create React App (react-scripts 5.0.1)
- Jest (testing, via CRA)
- React Testing Library 13.4.0

**Deployment:**
- GitHub Pages (static hosting via `docs` folder)
- No backend server required

## Project Architecture

```
wordle-replay-react/
├── src/
│   ├── App.js                    # Main application component & state management
│   ├── App.css                   # Global styling
│   ├── components/               # React components (14 files)
│   │   ├── Game.js               # Main game orchestrator
│   │   ├── GuessesBoard.js       # 6x5 guess grid display
│   │   ├── Keyboard.js           # Virtual keyboard with color-coded letters
│   │   ├── ResponsiveAppBar.js   # Navigation bar with settings
│   │   ├── SettingsMenu.js       # Dark/hard/colorblind mode toggles
│   │   ├── CalendarDialog.js     # Date picker dialog
│   │   ├── PuzzleNumSelectorDialog.js  # Puzzle number selector
│   │   ├── SuggestionsDialog.js  # Hint suggestions display
│   │   ├── StatsDialog.js        # Statistics and history view
│   │   ├── HistoryTable.js       # Paginated puzzle history
│   │   ├── WonDialog.js          # Win celebration with share options
│   │   ├── InvalidGuessDialog.js # Invalid word error
│   │   ├── AboutPage.js          # About page
│   │   ├── NewsPage.js           # News/blog page
│   │   └── ...
│   ├── assets/                   # Static data files
│   │   ├── date_to_word.js       # Map of dates to solutions (~1,700 puzzles)
│   │   └── wordle_acceptable_words.js  # Valid guess words (14,857 words)
│   ├── utils.js                  # Game logic utilities
│   ├── hardModeWordsFiltering.js # Hard mode constraint logic
│   ├── db.js                     # IndexedDB operations
│   ├── constants.js              # Configuration constants
│   └── tests/                    # Jest test suites (11 files)
├── public/
│   ├── index.html                # HTML template
│   ├── markdown/news/            # News post markdown files
│   ├── images/                   # Logos, favicons, share images
│   └── 404.html                  # SPA routing fallback
├── auto_update/                  # Word list update automation
│   ├── auto_update_word_list.sh  # Bash orchestrator script
│   └── query_new_wordle_words.py # Python NYT API fetcher
├── build/                        # Production build output
├── docs/                         # GitHub Pages deployment source
└── package.json
```

## Core Game Logic

### Guess Ranking (`utils.js`)

The `getGuessRanks()` function compares each guess against the answer:
- **2 (Green):** Correct letter in correct position
- **1 (Yellow):** Correct letter in wrong position
- **0 (Gray):** Letter not in word (or already accounted for)

### Suggestion Algorithm (`utils.js`)

The `getTopSuggestions()` function ranks valid words by:
1. Fewest duplicate letters (prefer diverse letters)
2. Highest overall letter frequency score
3. Highest position-specific letter frequency score
4. Alphabetical order (tiebreaker)

### Hard Mode Filtering (`hardModeWordsFiltering.js`)

Extracts constraints from each guess:
- Required positions (green letters)
- Forbidden positions (yellow letters)
- Letter count minimums/maximums

Filters the word list to only include valid guesses that satisfy all constraints.

### Navigation Utilities (`utils.js`)

- `dateToPuzzleNum()` / `puzzleNumToDate()` - Date/number conversions
- `getNextUnsolvedDate()` / `getPreviousUnsolvedDate()` - Navigate unsolved puzzles
- `getClosestUnsolvedDate()` - Find nearest unsolved (alternates forward/backward)

## State Management

All state is managed in `App.js` using React hooks:

**Game State:**
- `puzzleDate`, `puzzleNum` - Current puzzle identifier
- `answer` - Solution word
- `guessesData` - 2D array of guessed letters
- `guessesColors` - Color feedback per guess
- `letterMaxRanks` - Best color rank per keyboard letter
- `solved` - Puzzle completion status

**Settings (persisted to localStorage):**
- `colorMode` - 'light' or 'dark'
- `hardMode` - Boolean
- `colorBlindMode` - Boolean (orange/blue palette)
- `suggestionsVisible` - Boolean

**Database State:**
- `guessesDB` - Object map of all puzzle history
- `distributionData` - Guess count distribution
- `seenInsights` - Hard mode constraints

## Data Storage

### IndexedDB

**Database:** `wordlereplay_db` (v1)

**Object Store:** `guesses`
```javascript
{
  date: "2021-06-19",           // keyPath
  puzzleNum: 0,
  solvedDate: "2021-06-20",     // null if unsolved
  guesses: [
    ['A','R','I','S','E'],
    ['S','M','O','K','E']
  ]
}
```

### localStorage

- `colorMode` - Theme preference
- `hardMode` - Hard mode toggle
- `colorBlindMode` - Colorblind mode toggle
- `suggestionsVisible` - Suggestions toggle
- `maxSeenNewsPostId` - News badge tracking

### Static Assets

- **date_to_word.js** (~50KB) - Date-to-solution mapping from NYT Wordle API
- **wordle_acceptable_words.js** (~160KB) - 14,857 valid guess words

## Theming

MUI ThemeProvider with dynamic theme switching:

| Mode | Green | Yellow | Gray |
|------|-------|--------|------|
| Light | #6AAA64 | #FFC107 | #787C7E |
| Dark | #538D4E | #B59F3B | #515154 |
| Colorblind Light | #F5793A (orange) | #85C0F9 (blue) | #787C7E |
| Colorblind Dark | #F5793A (orange) | #85C0F9 (blue) | #515154 |

Responsive sizing via `useScreenSize()` custom hook:
- Board: 50% screen height, 90% width
- Keyboard: 25% screen height

## Local Development

Clone the repo and navigate to the project directory:

```bash
git clone <repo-url>
cd wordle-replay-react
npm install
```

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

Hot reloading enabled - the page reloads on code changes.

### `npm test`

Launches Jest test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Testing

**Framework:** Jest + React Testing Library

**Test Suites (11 files in `src/tests/`):**

| Test File | Coverage |
|-----------|----------|
| `suggestions.test.js` | Word ranking & suggestion algorithm |
| `datesAndPuzzleNums.test.js` | Date conversions & puzzle math |
| `getGuessRanks.test.js` | Color rank calculation |
| `hardModeWordsFilter.test.js` | Constraint filtering |
| `unsolvedDates.test.js` | Navigation date calculations |
| `processGuessesDB.test.js` | Database state processing |
| `formatOldDataForIndexedDB.test.js` | Legacy data migration |
| `union.test.js` | Set operations |
| `isSingleEnglishLetter.test.js` | Input validation |
| `getLetterAlphabetIndex.test.js` | Letter indexing |
| `blank.test.js` | Placeholder |

Run with coverage:
```bash
npm test -- --coverage
```

## Deployment

The app is deployed via GitHub Pages from the `docs` folder on the main branch.

### `npm run predeploy`

The only script needed for deployment. It:
1. Builds the app for production to `build/`
2. Clears the `docs/` folder
3. Copies `build/` contents to `docs/`

After running:
```bash
git add .
git commit -m "Deploy update"
git push origin main
```

GitHub Pages automatically serves the updated site.

### GitHub Pages Configuration

- **Source:** `docs` folder on main branch
- **Custom Domain:** wordlereplay.com (CNAME file in `docs/`)
- **HTTPS:** Automatically enabled
- **SPA Routing:** `404.html` redirects to index for client-side routing

## Word List Updates

The NYT publishes Wordle solutions in advance. To fetch new words:

### Manual Process

1. Visit `https://www.nytimes.com/svc/wordle/v2/YYYY-MM-DD.json` (replace with a future date)
2. Test dates incrementally to find the latest available date
3. Run the update script:

```bash
cd auto_update
./auto_update_word_list.sh 2026-04-20  # Replace with discovered date
```

### What the Script Does

1. Pulls latest changes from git
2. Python script queries NYT API for each date
3. Appends new words to `src/assets/date_to_word.js`
4. Prompts to commit and push changes

**Frequency:** Run weekly or when users report missing puzzles.

## Adding News Posts

1. Create a markdown file in `public/markdown/news/` (e.g., `my-post.md`)
   - Do not include the title in the file
   - Avoid h1 (`#`) and h2 (`##`) headers

2. Add metadata to the `newsPosts` array in `src/constants.js`:
```javascript
{
  id: 5,  // Increment from previous
  title: "My Post Title",
  date: "2026-03-29",
  path: "my-post.md"
}
```

News badge appears in the navigation bar when unread posts exist.

## Analytics

**Google Analytics 4 (GA4)**
- Tracking ID: `G-01HW9LNMG2`
- Loaded via gtag.js in `public/index.html`
- Tracks page views and user interactions

Transfer consideration: GA property should be transferred to new owner.

## Known Limitations

- **No user accounts** - All data stored locally in browser
- **Browser-specific history** - IndexedDB data doesn't sync across devices/browsers
- **Limited mobile optimization** - Functional but could be improved
- **No backend extensibility** - By design, fully client-side
- **No import/export** - Users cannot transfer their history

## Maintenance Requirements

| Task | Frequency | Time |
|------|-----------|------|
| Word list updates | Weekly | 10 min |
| Dependency updates | Monthly | 30 min |
| Bug fixes | As needed | Varies |
| Browser testing | Quarterly | 1 hour |

## Cost Structure

| Item | Cost |
|------|------|
| Hosting (GitHub Pages) | Free |
| Domain registration | ~$12/year |
| Backend/API | None required |
| **Total** | **~$12/year** |

## History

- **Early 2022:** Original version built with jQuery and Bootstrap ([repo](https://github.com/dougiss/wordle-replay), [demo](https://www.dougissi.com/wordle-replay))
- **2024:** Complete rewrite in React with Material-UI
- **Present:** Actively maintained with regular word list updates

---

## Quick Reference

| Script | Purpose |
|--------|---------|
| `npm start` | Development server |
| `npm test` | Run tests |
| `npm run build` | Production build |
| `npm run predeploy` | Build and prep for GitHub Pages |

| URL Parameter | Example | Purpose |
|---------------|---------|---------|
| `?date=YYYY-MM-DD` | `?date=2022-01-15` | Load specific puzzle by date |
| `?num=N` | `?num=100` | Load specific puzzle by number |

| Earliest Puzzle | Latest Puzzle |
|-----------------|---------------|
| June 19, 2021 (#0) | Continuously updated |
