import Home from "@pages/Home";
import Signin from "@pages/Signin";
import SigninSuccess from "@pages/SigninSuccess";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signin/success" element={<SigninSuccess />} />
        <Route path="*" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;