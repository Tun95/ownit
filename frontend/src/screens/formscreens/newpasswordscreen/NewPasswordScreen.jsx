import { Helmet } from "react-helmet-async";
import BackComponent from "../../../utilities/back/Back";
import NewPassword from "../../../components/form/newpassword/NewPassword";
import NavBar from "../../../common/navbar/NavBar";

function NewPasswordScreen() {
  return (
    <div className="dashboard_screen form_screens">
      <Helmet>
        <title>New Password</title>
      </Helmet>
      <NavBar />
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
