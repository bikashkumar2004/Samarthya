import { Route, Routes } from "react-router-dom";
import About from "./pages/front-view/About";
import Pricing from "./pages/front-view/Pricing";
import ContactUs from "./pages/front-view/ContactUs";
import Layout from "./components/front-view/Layout";

import Home from "./pages/front-view/Home";
import "./index.css";
import AuthLayout from "./components/authentication/AuthLayout";

import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import EmailVerify from "./pages/auth/EmailVerify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";

import AdminLayouts from "./components/admin-view/AdminLayouts";
import Dashbords from "./pages/admin-view/Dashbords";
import Leads from "./pages/admin-view/Leads";
import Contacts from "./pages/admin-view/Contacts";
import Marketings from "./pages/admin-view/Marketings";
import Conversations from "./pages/admin-view/Conversations";
import Workflows from "./pages/admin-view/Workflows";
import DetailDialog from "./components/admin-view/DetailDialog";

export default function App() {
  const dispatch = useDispatch();

  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contactUs" element={<ContactUs />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="register" element={<Register />} />
          <Route path="Login" element={<Login />} />
          <Route path="send-verify-otp" element={<EmailVerify />} />
        </Route>

        <Route path="/admin" element={<AdminLayouts />}>
          <Route path="Dashboard" element={<Dashbords />} />
          <Route path="Leads" element={<Leads />} />
          <Route path="Contacts" element={<Contacts />} />
          <Route path="Marketing" element={<Marketings />} />
          <Route path="Conversations" element={<Conversations />} />
          <Route path="Workflow" element={<Workflows />} />
        </Route>
      </Routes>
      {/* <DetailDialog/> */}
    </div>
  );
}
