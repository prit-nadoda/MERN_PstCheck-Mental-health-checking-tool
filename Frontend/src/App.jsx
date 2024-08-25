import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import AiAssistant from "./Pages/AiAssistant";
import AiContextProvider from "./context/AiAssistantContext";
import Navbar from "./components/Navbar/NavBar";
import SideBar from "./components/SideBar/SideBar";
import HomePage from "./Pages/Home/Home";
import SignUp from "./Pages/SignUp/SignUp";
import SignIn from "./Pages/SignIn/SignIn";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import VerifyEmail from "./Pages/VerifyEmail/VerifyEmail";
import ResetForgotPassword from "./Pages/ResetForgotPassword/ResetPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./main";
import axios from "axios";
import Assessment from "./Pages/assessment/Assessment";

const Layout = ({ toggleSidebar, isSidebarOpen }) => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/ai-assistant" && (
        <>
          <Navbar toggleSidebar={toggleSidebar} />
          <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      )}
    </>
  );
};

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Fetching user data, isAuthenticated:", isAuthenticated);
      try {
        // if (!isAuthenticated) return;
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/patient/me",
          {
            withCredentials: true,
          }
        );
        console.log("User data fetched:", response.data.user);
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        console.log("Error fetching user data:", error);
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <AiContextProvider>
      <Router>
        <Layout toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route
            path="/reset-forgot-password/:token"
            element={<ResetForgotPassword />}
          />
          <Route path="/ai-assistant" element={<AiAssistant />} />
        </Routes>
        <ToastContainer />
      </Router>
    </AiContextProvider>
  );
};

export default App;
