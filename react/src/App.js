import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import './App.css';
import Home from "./pages/Home";
import About from "./pages/About";
import Header1 from "./components/Header1";
import Page404 from "./pages/Page404";
import CounterPage from "./pages/CounterPage";
import ContextProvider from "./context/Context";
import ShopPage from "./pages/ShopPage";
import Login from "./pages/Login";


function App() {



  return (
    <ContextProvider>
      <BrowserRouter>
        <Header1 />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/counter" element={<CounterPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
