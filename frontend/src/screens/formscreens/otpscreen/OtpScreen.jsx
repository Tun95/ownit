import { Helmet } from "react-helmet-async";
import OtpVerificationComponent from "../../../components/form/otp/Otp";
import BackComponent from "../../../utilities/back/Back";
import NavBar from "../../../common/navbar/NavBar";

function OtpScreen() {
  return (
    <div className="dashboard_screen form_screens">
      <Helmet>
        <title>Otp</title>
      </Helmet>
      <NavBar />
      <div className="container">
        <BackComponent />
      </div>
      <div className="container  l_flex">
        <div className="content ">
          <OtpVerificationComponent />
        </div>
      </div>
    </div>
  );
}

export default OtpScreen;
