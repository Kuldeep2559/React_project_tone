import './App.css';
import Navbar from './Components/Navbar';
import TextForm from './Components/TextForm';
import InitialPage from './Components/InitialPage';
import { Routes, Route } from 'react-router-dom'; // Remove BrowserRouter from here

function App() {
  return (
    <>
      <Navbar text="AI Hub" />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<InitialPage />} />
          <Route path="/gemini" element={<TextForm />} />
        </Routes>
      </div>
    </>
  );
}

export default App;