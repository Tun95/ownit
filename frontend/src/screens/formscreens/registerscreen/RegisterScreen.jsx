import { Helmet } from "react-helmet-async";
import RegisterComponent from "../../../components/form/register/Register";
import BackComponent from "../../../utilities/back/Back";

function RegisterScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Register</title>
      </Helmet>
      <div className="container ">
        <BackComponent />
        <div className="content form_screen_content">
          <RegisterComponent />
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
