import { Route, Routes } from "react-router-dom";
// import About from "./pages/front-view/About";
// import Pricing from "./pages/front-view/Pricing";
// import ContactUs from "./pages/front-view/ContactUs";
// import Layout from "./components/front-view/Layout";
// import Home from "./pages/front-view/Home";
import "./index.css";
import AuthLayout from "./components/authentication/AuthLayout";
// import Register from "./pages/auth/Register.jsx";
// import Login from "./pages/auth/Login.jsx";
import EmailVerify from "./pages/auth/EmailVerify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import TaskManagement from "./pages/agent-view/task-management";
import AiCallMannager from "./pages/agent-view/aicallmanager";
import Dashboard from "./pages/agent-view/dashboard";
import Landing from "./pages/landing/Landing";
import Campaigns from "./pages/agent-view/campaigns";
import LeadManagement from "./pages/agent-view/leads";
import Pending from "./pages/agent-view/pending-followups";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ContactManagement from "./pages/agent-view/contacts";
import EmailVer from "./pages/auth/EmailVer";
import ComposeMsg from "./pages/agent-view/compose-message";
import SidebarDemo from "./components/agent-view/SidebarDemo";
import WhatsappInbox from "./pages/agent-view/whatsapp-inbox";
import Man from "./pages/manager-view/Man";
import SidebarManager from "./components/manager-view/SidebarManager";
import Assign from "./pages/manager-view/Assign";
import Team from "./pages/manager-view/Team";
import ReviewRejection from "./pages/manager-view/ReviewRejection";

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
        <Route path="/" element={<Landing />}></Route>

        <Route
          path="/auth"
          element={<AuthLayout />}
        >
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="send-verify-otp" element={<EmailVer />} />
        </Route>

        <Route path="/agent" element={<SidebarDemo />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="composemessage" element={<ComposeMsg />} />
          <Route path="whatsapp-inbox" element={<WhatsappInbox />} />


          <Route path="task-management" element={<TaskManagement />} />
          <Route path="my-contacts" element={<ContactManagement />} />
          <Route path="leads" element={<LeadManagement />} />
          <Route path="Leads" element={<LeadManagement />} />
          <Route path="aicallmanager" element={<AiCallMannager />} />
          <Route path="pending-followups" element={<Pending />} />

          <Route path="campaigns" element={<Campaigns />} />
        </Route>
        <Route path="/manager" element={<SidebarManager />}>
          <Route path="dashboard" element={<Man />} />
          <Route path="team" element={<Team />} />
          <Route path="assign" element={<Assign />} />
          <Route path="review-rejection" element={<ReviewRejection />} />

        </Route>
      </Routes>
    </div>
  );
}
