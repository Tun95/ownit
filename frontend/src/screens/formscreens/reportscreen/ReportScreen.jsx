import { Helmet } from "react-helmet-async";
import BackComponent from "../../../utilities/back/Back";
import ReportComponent from "../../../components/form/report/Report";

function ReportScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>Report</title>
      </Helmet>
      <div className="container ">
        <BackComponent />
        <div className="content form_screen_content">
          <ReportComponent />
        </div>
      </div>
    </div>
  );
}

export default ReportScreen;
