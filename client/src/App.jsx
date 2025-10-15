
import { Route, Routes } from "react-router-dom";
import About from "./pages/front-view/About";
import Pricing from "./pages/front-view/Pricing";
import Contact from "./pages/front-view/Contact";
import Layout from "./components/front-view/Layout";

import Home from "./pages/front-view/Home";
import "./index.css";
import AuthLayout from "./components/authentication/AuthLayout";

import Register from "./pages/auth/Register.jsx"
import Login from "./pages/auth/Login.jsx"
export default function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="/auth" element={<AuthLayout/>}>
          <Route path="register" element={<Register/>}/>
          <Route path="Login" element={<Login/>}/>
        </Route>
      </Routes>
    </div>
  );
}
