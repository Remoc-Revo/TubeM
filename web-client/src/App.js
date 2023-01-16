import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import PasteUrl from './pages/paste_url';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<PasteUrl/>}/> 
      </Routes>
    </Router>
  );
}

export default App;
