import MainNavBar from "../../../common/main navbar/MainNavBar";
import ReportsEdit from "../../../components/edit/reports/ReportsEdit";

function ReportsEditScreen() {
  return (
    <div className="dashboard_screen ">
      <MainNavBar />
      <div className="container mt">
        <div className="content">
          <ReportsEdit />
        </div>
      </div>
    </div>
  );
}

export default ReportsEditScreen;
