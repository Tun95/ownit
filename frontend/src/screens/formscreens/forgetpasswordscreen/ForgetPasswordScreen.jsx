import { Helmet } from "react-helmet-async";
import BackComponent from "../../../utilities/back/Back";
import ForgetPassword from "../../../components/form/forgetpassword/ForgetPassword";

function ForgetPasswordScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>

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
