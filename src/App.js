// import logo from './logo.svg';
import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import GuessesBoard from './components/GuessesBoard';
import Keyboard from './components/Keyboard';
// import useScreenSize from './components/useScreenSize';

function App() {
  // const screenSize = useScreenSize();

  return (
    <div className="App">
      <ResponsiveAppBar />
      {/* <div>
        <h1>Screen Size Detection with React Hook</h1>
        <p>Width: {screenSize.width}</p>
        <p>Height: {screenSize.height}</p>
      </div> */}

      <GuessesBoard />
      <Keyboard />

      {/* Default create-react-app screen */}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
