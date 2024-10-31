import { Helmet } from "react-helmet-async";
import CreatedAccountComponent from "../../../components/form/created/Created";
import BackComponent from "../../../utilities/back/Back";
import NavBar from "../../../common/navbar/NavBar";

function CreatedScreen() {
  return (
    <div className="dashboard_screen form_screens">
      <Helmet>
        <title>Created Successfully</title>
      </Helmet>
      <NavBar />
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
