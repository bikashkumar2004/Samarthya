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

import AgentLayouts from "./components/agent-view/AgentLayouts";
import Dashboard from "./pages/agent-view/Dashboard";
import Leads from "./pages/agent-view/Leads";
import Workflows from "./pages/agent-view/Workflows";
import CreateTask from "./pages/agent-view/CreateTask";
import AiCallMannager from "./pages/agent-view/AiCallManager";

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

        <Route path="/agent" element={<AgentLayouts />}>
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="createtask" element={<CreateTask />} />
          <Route path="Leads" element={<Leads />} />
          <Route path="aicallmanager" element={<AiCallMannager />} />

          <Route path="Workflow" element={<Workflows />} />
        </Route>
      </Routes>
      {/* <DetailDialog/> */}
    </div>
  );
}
