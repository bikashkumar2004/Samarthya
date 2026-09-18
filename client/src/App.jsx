import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./index.css";

// Auth
import { checkAuth } from "./store/auth-slice";
import AuthLayout from "./components/authentication/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import EmailVer from "./pages/auth/EmailVer";

// Public / Landing
import Landing from "./pages/landing/Landing";

// Agent View Layout & Pages
import SidebarDemo from "./components/agent-view/SidebarDemo";
import Dashboard from "./pages/agent-view/dashboard";
import ComposeMsg from "./pages/agent-view/compose-message";
import WhatsappInbox from "./pages/agent-view/whatsapp-inbox";
import TaskManagement from "./pages/agent-view/task-management";
import ContactManagement from "./pages/agent-view/contacts";
import LeadManagement from "./pages/agent-view/leads";
import AiCallMannager from "./pages/agent-view/aicallmanager";
import Pending from "./pages/agent-view/pending-followups";
import Campaigns from "./pages/agent-view/campaigns";

// Manager View Layout & Pages
import SidebarManager from "./components/manager-view/SidebarManager";
import Man from "./pages/manager-view/Man";
import Team from "./pages/manager-view/Team";
import Assign from "./pages/manager-view/Assign";
import ReviewRejection from "./pages/manager-view/ReviewRejection";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<Landing />} />

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="send-verify-otp" element={<EmailVer />} />
        </Route>

        {/* Agent View Routes */}
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

        {/* Manager View Routes */}
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
