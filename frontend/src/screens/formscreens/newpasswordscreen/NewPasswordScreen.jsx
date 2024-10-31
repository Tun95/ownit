import { Helmet } from "react-helmet-async";
import BackComponent from "../../../utilities/back/Back";
import NewPassword from "../../../components/form/newpassword/NewPassword";

function NewPasswordScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>New Password</title>
      </Helmet>

      <div className="container  ">
        <BackComponent />
        <div className="content form_screen_content">
          <NewPassword />
        </div>
      </div>
    </div>
  );
}

export default NewPasswordScreen;
