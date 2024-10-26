import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/main navbar/MainNavBar";
import ReportsListComponent from "../../../components/list/reports/ReportsList";

function ReportsListScreen() {
  return (
    <div className="dashboard_screen ">
      <Helmet>
        <title>All Reports</title>
      </Helmet>
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <ReportsListComponent />
        </div>
      </div>
    </div>
  );
}

export default ReportsListScreen;
