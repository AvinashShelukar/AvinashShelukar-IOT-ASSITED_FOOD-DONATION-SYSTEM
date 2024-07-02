import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalContex } from "./context/contex";
import { ToastContainer } from "react-toastify";

// components
import Navbar from "./components/Navbar.js";
// pages
import SignIn from "./pages/Authentication/SignIn.js";
import SignUp from "./pages/Authentication/SignUp.js";
import FogotPassword from "./pages/Authentication/ForgotPassword.js";
import ResetPassword from "./pages/Authentication/ResetPassword.js";
import Home from "./pages/Home";
import Donations from "./pages/Donations/Index.js";
import Logout from "./components/popUp/Logout.js";
import Donate from "./pages/Donate";
import Status from "./pages/Status";
import Profile from "./pages/Profile";
import Requests from "./pages/requests/Index.js";
import Agents from "./pages/Agents/Index.js";
import Donors from "./pages/Donors";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Assigned from "./pages/Assigned/Index";
import AddAgent from "./pages/AddAgent";
import PageNotFound from "./PageNotFound";
import NotificationComponent from "./components/NotificationComponent.js";

// npm package
// import { io } from "socket.io-client";
import axios from "axios";

function App() {
  const {
    setSocketInstance,
    notify,
    showNotificationComponent,
    setNotificationData
  } = useContext(GlobalContex);
  const URL = process.env.REACT_APP_URL;

  // sockets  code
  // const socket = io(URL);
  // socket.on("connect_error", (error) => {
  //   console.log(error);
  // });

  // socket.on("private_notification", (data) => {
  //   setNotificationData((preVal) => {
  //     return { ...preVal, notifications: [data, ...preVal.notifications] };
  //   });
  // });

  const {
    setUserData,
    userLoading,
    showLogoutPopUp,
    setUserLoading,
    setTOKEN,
    TOKEN
  } = useContext(GlobalContex);

  useEffect(() => {
    if (sessionStorage.getItem("Token")) {
      const isTokenexpired = new Date(TOKEN.expirydate) < new Date();
      if (isTokenexpired) setTOKEN({ token: "", expirydate: new Date() });
    }
    getUser();
  }, []);

  async function getUser() {
    setUserLoading(true);
    try {
      const response = await axios({
        method: "get",
        url: URL + "/api/user",
        headers: {
          Authorization: "Bearer " + TOKEN.token
        },
        withCredentials: true
      });
      const user = response.data.data;
      if (response.data.success) {
        setUserData(user);
        setUserLoading(false);

        // setSocketInstance(socket);
        // socket.emit("register", {
        //   role: user.role,
        //   id: user._id,
        //   name: user.firstName + " " + user.lastName,
        //   email: user.email
        // });
      }
    } catch (error) {
      setUserLoading(false);
      // notify(error.response.data.message, "error");
    }
  }

  return (
    <div className="scroll App h-[100vh]">
      {userLoading ? (
        <div className="hero-particles   h-full w-full"></div>
      ) : (
        <>
          <Navbar />
          <div className=" h-full pt-20">
            <Routes>
              <Route path="/sign_in" element={<SignIn />} />
              <Route path="/sign_up" element={<SignUp />} />
              <Route path="/forgot_password" element={<FogotPassword />} />
              <Route
                path="/reset_password/:resetPasswordToken"
                element={<ResetPassword />}
              />
              <Route path="/" element={<Home />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/donations" element={<Donations />} />
                <Route path="/donations/:donationId" element={<Donations />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/status" element={<Status />} />
                <Route path="/status/:donationId" element={<Status />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/requests/:donationId" element={<Requests />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/agents/:userId" element={<Agents />} />
                <Route path="/donors" element={<Donors />} />
                <Route path="/donors/:userId" element={<Donors />} />
                <Route path="/assigned" element={<Assigned />} />
                <Route path="/assigned/:donationId" element={<Assigned />} />
                <Route path="/add_agent" element={<AddAgent />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
          {/* // logout popup */}
          {showLogoutPopUp ? <Logout /> : null}
          {/* // tostify */}
          <ToastContainer />
          {/* showNotificationComponent */}
          {showNotificationComponent ? <NotificationComponent /> : null}
        </>
      )}
    </div>
  );
}

export default App;
