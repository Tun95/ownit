import { Helmet } from "react-helmet-async";
import BackComponent from "../../../utilities/back/Back";
import ForgetPassword from "../../../components/form/forgetpassword/ForgetPassword";
import NavBar from "../../../common/navbar/NavBar";

function ForgetPasswordScreen() {
  return (
    <div className="dashboard_screen form_screens">
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <NavBar />
      <div className="container  ">
        <BackComponent />
        <div className="content form_screen_content">
          <ForgetPassword />
        </div>
      </div>
    </div>
  );
}

export default ForgetPasswordScreen;
