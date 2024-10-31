import { Helmet } from "react-helmet-async";
import BackComponent from "../../../utilities/back/Back";
import ReportComponent from "../../../components/form/report/Report";
import NavBar from "../../../common/navbar/NavBar";

function ReportScreen() {
  return (
    <div className="dashboard_screen form_screens">
      <Helmet>
        <title>Report</title>
      </Helmet>
      <NavBar />
      <div className="container ">
        <BackComponent />
        <div className="content ">
          <ReportComponent />
        </div>
      </div>
    </div>
  );
}

export default ReportScreen;
