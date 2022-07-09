import React from "react"
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/view.js/navbar/Navbar";
import Home from "./components/view.js/home/Home";
function App() {
  return (
    <div>
      {/* Component for toaster Messages */}
      <ToastContainer/>
      <Navbar />
      <Home/>
    </div>
  );
}

export default App;
