import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import "./App.css";

import { Route, Routes } from "react-router-dom";
import NotFoundScreen from "./utilities/404 error/PageNotFound";
import HomeScreen from "./screens/homescreen/HomeScreen";
import NavBar from "./common/navbar/NavBar";
import RegisterScreen from "./screens/formscreens/registerscreen/RegisterScreen";
import LoginScreen from "./screens/formscreens/loginscreen/LoginScreen";
import OtpScreen from "./screens/formscreens/otpscreen/OtpScreen";
import CreatedScreen from "./screens/formscreens/createdscreen/CreatedScreen";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
function App() {
  return (
    <>
      <div className="app">
        <ToastContainer position="bottom-center" limit={1} />
        <NavBar />
        <Routes>
          <Route path="*" element={<NotFoundScreen />} />
          <Route path="/" element={<HomeScreen />}></Route>
          {/* VALIDATION */}
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />{" "}
          <Route path="/otp" element={<OtpScreen />} /> {/* VALIDATION */}
          <Route path="/created" element={<CreatedScreen />} />
          {/* VALIDATION */}
        </Routes>
      </div>
    </>
  );
}

export default App;
