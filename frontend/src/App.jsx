import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import ReactGA from "react-ga4";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

import { Route, Routes } from "react-router-dom";
import NotFoundScreen from "./utilities/404 error/PageNotFound";
import HomeScreen from "./screens/homescreen/HomeScreen";
import RegisterScreen from "./screens/formscreens/registerscreen/RegisterScreen";
import LoginScreen from "./screens/formscreens/loginscreen/LoginScreen";
import OtpScreen from "./screens/formscreens/otpscreen/OtpScreen";
import CreatedScreen from "./screens/formscreens/createdscreen/CreatedScreen";
import ReportScreen from "./screens/formscreens/reportscreen/ReportScreen";
import { useEffect } from "react";
import NewPasswordScreen from "./screens/formscreens/newpasswordscreen/NewPasswordScreen";
import ForgetPasswordScreen from "./screens/formscreens/forgetpasswordscreen/ForgetPasswordScreen";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
function App() {
 

  ReactGA.initialize(import.meta.env.VITE_REACT_APP_GOOGLE_TRACKING, {
    debug: true,
    titleCase: false,
    gaOptions: {
      userId: 123,
    },
  });

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);
  return (
    <>
      <div className="app">
        <ToastContainer position="bottom-center" limit={1} />

        <Routes>
          <Route path="*" element={<NotFoundScreen />} />
          <Route path="/" element={<HomeScreen />}></Route>
          {/* VALIDATION */}
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />{" "}
          <Route path="/otp" element={<OtpScreen />} />
          <Route path="/created" element={<CreatedScreen />} />
          <Route
            path="/lost-password"
            element={<ForgetPasswordScreen />}
          ></Route>
          <Route
            path="/:id/new-password/:token"
            element={<NewPasswordScreen />}
          ></Route>
          {/* VALIDATION */}
          <Route path="/report" element={<ReportScreen />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
