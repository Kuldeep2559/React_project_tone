//import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import TextForm from './Components/TextForm';

function App() {
  return (
    <>
      <Navbar text="Text Utils"/>
      <div className="container">
      <TextForm/>
      </div>
    </>
  );
}

export default App;


