import { Helmet } from "react-helmet-async";
import Intro from "../../components/home/intro/Intro";

function HomeScreen() {
  return (
    <div className="home_screen">
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="home_content">
        <Intro />
      </div>
    </div>
  );
}

export default HomeScreen;
