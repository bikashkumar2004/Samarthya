
import { Route, Routes } from "react-router-dom";
import About from "./pages/front-view/About";
import Pricing from "./pages/front-view/Pricing";
import ContactUs from "./pages/front-view/ContactUs";
import Layout from "./components/front-view/Layout";

import Home from "./pages/front-view/Home";
import "./index.css";
import AuthLayout from "./components/authentication/AuthLayout";

import Register from "./pages/auth/Register.jsx"
import Login from "./pages/auth/Login.jsx"
import EmailVerify from "./pages/auth/EmailVerify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";

import AdminLayout from "./pages/admin/AdminLayout"
import DashBoard from "./components/admin/DashBoard";
import Lead from "./components/admin/Lead";
import Contact from "./components/admin/Contact";
import Markting from "./components/admin/Markting";
import Conversation from "./components/admin/Conversation";
import Workflow from "./components/admin/Workflow";






export default function App() {
  const dispatch=useDispatch();
 
  const {user,isAuthenticated,isLoading}=useSelector(state=>state.auth)
  useEffect(()=>{
    dispatch(checkAuth())
  },[dispatch])
  
  return (
    <div >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contactUs" element={<ContactUs />} />
        </Route>
        <Route path="/auth" element={<AuthLayout/>}>
          <Route path="register" element={<Register/>}/>
          <Route path="Login" element={<Login/>}/>
          <Route path="send-verify-otp" element={<EmailVerify/>}/>
        </Route>
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<DashBoard/>}/>
          <Route path="lead" element={<Lead/>}/>
          <Route path="contact" element={<Contact/>}/>
          <Route path="markting" element={<Markting/>}/>
          <Route path="conversation" element={<Conversation/>}/>
          <Route path="workflow" element={<Workflow/>}/>
        </Route>
      </Routes>
    </div>
  );
}
