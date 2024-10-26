import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import "./App.css";

import { Route, Routes } from "react-router-dom";
import AdminRoute from "./utilities/protectedRoute/AdminRoute";
import RegisterScreen from "./screens/formscreens/registerscreen/RegisterScreen";
import LoginScreen from "./screens/formscreens/loginscreen/LoginScreen";
import OtpScreen from "./screens/formscreens/otpscreen/OtpScreen";
import DashboardScreen from "./screens/dashboardscreen/DashboardScreen";
import UserListScreen from "./screens/userscreen/listscreen/UserListScreen";
import UserEditScreen from "./screens/userscreen/editscreen/UserEditScreen";
import CreatedScreen from "./screens/formscreens/createdscreen/CreatedScreen";
import MessageScreen from "./screens/messagescreen/MessageScreen";
import ReportsEditScreen from "./screens/reportscreen/editscreen/ReportsEditScreen";
import ReportsListScreen from "./screens/reportscreen/listscreen/ReportsListScreen";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
function App() {
  return (
    <>
      <div className="app">
        <ToastContainer position="bottom-center" limit={1} />{" "}
        <Routes>
          {/* VALIDATION */}
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />{" "}
          <Route path="/otp" element={<OtpScreen />} /> {/* VALIDATION */}
          <Route path="/created" element={<CreatedScreen />} />
          {/* VALIDATION */}
          <Route
            path="/"
            element={
              <AdminRoute>
                <DashboardScreen />
              </AdminRoute>
            }
          />
          {/* USER */}
          <Route
            path="/users"
            element={
              <AdminRoute>
                <UserListScreen />
              </AdminRoute>
            }
          />{" "}
          <Route
            path="/user/:id"
            element={
              <AdminRoute>
                <UserEditScreen />
              </AdminRoute>
            }
          />
          {/* EVENTS */}
          <Route
            path="/reports"
            element={
              <AdminRoute>
                <ReportsListScreen />
              </AdminRoute>
            }
          />{" "}
          <Route
            path="/reports/:id"
            element={
              <AdminRoute>
                <ReportsEditScreen />
              </AdminRoute>
            }
          />
          {/* MESSAGE */}
          <Route
            path="/message"
            element={
              <AdminRoute>
                <MessageScreen />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
