# Wordle Replay React

## About
[WordleReplay.com](https://wordlereplay.com) is a web application that allows you to replay any [Wordle](https://en.wikipedia.org/wiki/Wordle) game that's been published to date. It also provides its top suggestions for your next guess when case you get stuck.

The original version of the application was written using [JQuery](https://jquery.com/) and [Bootstrap](https://getbootstrap.com/) in early 2022, and that version can be found here: [GitHub repo](https://github.com/dougiss/wordle-replay) and [game](https://www.dougissi.com/wordle-replay).

This version provides many new features and is written using [React](https://react.dev/) and [Material UI](https://mui.com/).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Local Development

To run the app locally, clone the repo and then navigate to the project directory. At that point these scripts are useful for local development.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

Most of the Javascript utility functions have unit tests using Jest, located in the `src/tests` folder.

## Add a News Post

To add a news post, create a new Markdown .md file in the `src/news` folder that contains all of the content of the post (yes, using Markdown). Each time a new post is deployed, the UI will also add badge icons to the navigation bar to nudge the users to see the latest news.

Notes:
* Do not include the title in the Markdown file, as that will be based on the `newsPost` array (see below)
* Do not include any h1 or h2 headers in the Markdown file (e.g., `# My Page Title` or `## My Post Title`).

Afterward, add metadata about the post to the `newsPosts` array in `src/constants.js`. The title and date in this array are what will appear in the News page.

## Deployment

Currently the app is deployed using GitHub pages, based on the main branch and the `docs` folder.

### `npm run predeploy`

This is the only script that needs to be run to prep the project for deployment. It does the following:

1. Builds the app for production to the `build` folder.
2. Deletes the contents of the `docs` folder.
3. Copies the contents of the `build` folder to the `docs` folder.

After running this script, you must commit and push to the main branch to deploy your changes.

See the "predeploy" script in "package.json" for its implementation details.

The scripts that follow in this section are not necessary for deployment, but they're included here for reference.

### `npm run build`

This script is run automatically by the "predeploy" script above, but I've included it here for reference.

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

