import Home from "@pages/Home";
import Signin from "@pages/Signin";
import SigninSuccess from "@pages/SigninSuccess";
import Play from "@pages/Play";
import "./App.scss";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Test from "@pages/Test";

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route path="/test" element={<Test />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signin/success" element={<SigninSuccess />} />
        <Route path="/mango/:ref" element={<Play type={"mango"} />} />
        <Route path="/beans/:ref" element={<Play type={"beans"} />} />
        <Route path="*" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;