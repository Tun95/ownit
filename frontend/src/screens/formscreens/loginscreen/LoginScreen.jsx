import { Helmet } from "react-helmet-async";
import LoginComponent from "../../../components/form/login/Login";
import "./styles.scss";
import BackComponent from "../../../utilities/back/Back";

function LoginScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Log in</title>
      </Helmet>

      <div className="container  ">
        <BackComponent />
        <div className="content form_screen_content">
          <LoginComponent />
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
