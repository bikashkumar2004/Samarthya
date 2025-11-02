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
import { useEffect} from "react";
import { checkAuth } from "./store/auth-slice";
import AgentLayouts from "./components/agent-view/AgentLayouts";
// import Leads from "./pages/agent-view/Leads";
import CreateTask from "./pages/agent-view/CreateTask";
import AiCallMannager from "./pages/agent-view/AiCallManager";
import Dashboard from "./pages/agent-view/Dashboardlayout";
import Landing from "./pages/landing/Landing";
import Campaigns from "./pages/agent-view/Campaigns";
import LeadManagement from "./pages/agent-view/LeadManagement";
import Pending from "./pages/agent-view/Pending";
import Inbox from "./components/agent-view/Inbox";
import Sms from "./pages/agent-view/Sms";
import Email from "./pages/agent-view/Email";
import Whatsapp from "./pages/agent-view/Whatsapp";
import SamarthyaLanding from "./pages/SamarthyaLanding";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ContactManagement from "./pages/agent-view/ContactManagement";
import EmailVer from "./pages/auth/EmailVer";
import ComposeMsg from "./pages/agent-view/ComposeMsg";

export default function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  // Global Theme State
  // const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply theme to <html> element (CRITICAL FIX)
  // useEffect(() => {
  //   const root = window.document.documentElement;
  //   root.classList.remove("light", "dark");
  //   root.classList.add(theme);
  //   localStorage.setItem("theme", theme);
  // }, [theme]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />}></Route>

        <Route
          path="/auth"
          element={<AuthLayout  />}
        >
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage/>} />
          {/* <Route path="send-verify-otp" element={<EmailVerify />} /> */}
          <Route path="send-verify-otp" element={<EmailVer />} />
        </Route>

        <Route path="/agent" element={<AgentLayouts />}>
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="inbox" element={<Inbox/>}>
            <Route path="composemessage" element={<ComposeMsg/>}/>
            <Route path="sms" element={<Sms/>}/>
            <Route path="email" element={<Email/>}/>
            <Route path="whatsapp" element={<Whatsapp/>}/>
          </Route>
          
          <Route path="createtask" element={<CreateTask />} />
          <Route path="my-contacts" element={<ContactManagement />} />
          {/* <Route path="Leads" element={<Leads />} /> */}
          <Route path="Leads" element={<LeadManagement />} />
          <Route path="aicallmanager" element={<AiCallMannager />} />
          <Route path="pending-followups" element={<Pending />} />

          <Route path="campaigns" element={<Campaigns />} />
        </Route>
      </Routes>
      {/* <SamarthyaLanding/> */}
      
      {/* <RegisterPage/> */}
    </div>
  );
}
