import { Helmet } from "react-helmet-async";
import CreatedAccountComponent from "../../../components/form/created/Created";
import BackComponent from "../../../utilities/back/Back";

function CreatedScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Created Successfully</title>
      </Helmet>
      <div className="container">
        <BackComponent />
      </div>
      <div className="container l_flex ">
        <div className="content ">
          <CreatedAccountComponent />
        </div>
      </div>
    </div>
  );
}

export default CreatedScreen;
