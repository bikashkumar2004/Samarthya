import { Route, Routes } from "react-router-dom";
// import About from "./pages/front-view/About";
// import Pricing from "./pages/front-view/Pricing";
// import ContactUs from "./pages/front-view/ContactUs";
// import Layout from "./components/front-view/Layout";
// import Home from "./pages/front-view/Home";
import "./index.css";
import AuthLayout from "./components/authentication/AuthLayout";
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import EmailVerify from "./pages/auth/EmailVerify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkAuth } from "./store/auth-slice";
import AgentLayouts from "./components/agent-view/AgentLayouts";
import Leads from "./pages/agent-view/Leads";
import Workflows from "./pages/agent-view/Workflows";
import CreateTask from "./pages/agent-view/CreateTask";
import AiCallMannager from "./pages/agent-view/AiCallManager";
import Dashboard from "./pages/agent-view/Dashboardlayout";
import Landing from "./pages/landing/Landing";

export default function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Global Theme State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply theme to <html> element (CRITICAL FIX)
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing/>}>
        </Route>

      <Route
        path="/auth"
        element={<AuthLayout theme={theme} setTheme={setTheme} />}
      >
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
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
      
    </div>
  );
}
