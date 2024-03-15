import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./Components/Navbar/Nav";
import Login from "./Components/Account/Login";
import Register from "./Components/Account/Register";
import HomePage from "./Components/Home/HomePage";
import AddPage from "./Components/Home/ADD/AddPage";
import UpdatePage from "./Components/Home/UPDATE/UpdatePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/update/:addNoteId" element={<UpdatePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
