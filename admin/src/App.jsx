import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import "./App.css";
import "photoviewer/dist/photoviewer.css";


import { Route, Routes } from "react-router-dom";
import NotFoundScreen from "./utilities/404 error/PageNotFound";
import AdminRoute from "./utilities/protectedRoute/AdminRoute";
import DashboardScreen from "./screens/dashboardscreen/DashboardScreen";
import RegisterScreen from "./screens/formscreens/registerscreen/RegisterScreen";
import LoginScreen from "./screens/formscreens/loginscreen/LoginScreen";
import OtpScreen from "./screens/formscreens/otpscreen/OtpScreen";
import CreatedScreen from "./screens/formscreens/createdscreen/CreatedScreen";
import UserListScreen from "./screens/userscreen/listscreen/UserListScreen";
import UserEditScreen from "./screens/userscreen/editscreen/UserEditScreen";
import ReportsListScreen from "./screens/reportscreen/listscreen/ReportsListScreen";
import ReportsEditScreen from "./screens/reportscreen/editscreen/ReportsEditScreen";
import MessageScreen from "./screens/messagescreen/MessageScreen";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
function App() {
  return (
    <>
      <div className="app">
        <ToastContainer position="bottom-center" limit={1} />{" "}
        <Routes>
          <Route path="*" element={<NotFoundScreen />} />
          <Route
            path="/"
            element={
              <AdminRoute>
                <DashboardScreen />
              </AdminRoute>
            }
          />
          {/* VALIDATION */}
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />{" "}
          <Route path="/otp" element={<OtpScreen />} /> {/* VALIDATION */}
          <Route path="/created" element={<CreatedScreen />} />
          {/* VALIDATION */}
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
          {/* REPORTS */}
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
