import { Helmet } from "react-helmet-async";
import Intro from "../../components/home/intro/Intro";
import Citizen from "../../components/home/citizen/Citizen";
import Reporting from "../../components/home/reporting/Reporting";
import Intiative from "../../components/home/initiative/Intiative";
import SubmitComponent from "../../components/home/submit/Submit";
import Footer from "../../common/footer/Footer";
import NavBar from "../../common/navbar/NavBar";

function HomeScreen() {
  return (
    <div className="home_screen">
      <Helmet>
        <title>Home</title>
      </Helmet>
      <NavBar />
      <div className="home_content">
        <Intro />
        <Citizen />
        <Reporting />
        <Intiative />
        <SubmitComponent />
        <Footer />
      </div>
    </div>
  );
}

export default HomeScreen;
