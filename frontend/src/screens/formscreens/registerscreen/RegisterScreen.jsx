import { Helmet } from "react-helmet-async";
import RegisterComponent from "../../../components/form/register/Register";
import BackComponent from "../../../utilities/back/Back";
import NavBar from "../../../common/navbar/NavBar";

function RegisterScreen() {
  return (
    <div className="dashboard_screen form_screens">
      <Helmet>
        <title>Register</title>
      </Helmet>
      <NavBar />
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
