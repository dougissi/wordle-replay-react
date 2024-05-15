import './App.css';
import { Route, Routes } from "react-router-dom";
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Game from './components/Game';

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <Routes>
        <Route path='/' element={<Game />} />
        <Route path='/test' element={<div>Doug test</div>} />
      </Routes>
    </div>
  );
}

export default App;
