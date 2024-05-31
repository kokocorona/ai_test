import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import './App.css';
import Home from "./pages/Home";
import About from "./pages/About";
import Header1 from "./components/Header1";
import Page404 from "./pages/Page404";
import CounterPage from "./pages/CounterPage";
import { AppContext } from "./context/Context";


function App() {
  const [counter,setCounter] = useState(33)

  // Value - כל מה שיהיה מהמאפיין שנעביר לווליו
  // יהפוך להיות גלובלי לכל הקומפנינטת ש
  // APPCONTEXT PROVIDER עוטף
  return (
    <AppContext.Provider value={{counter,setCounter}}>
      <BrowserRouter>
        <Header1 />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/counter" element={<CounterPage />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
