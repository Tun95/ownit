import { Helmet } from "react-helmet-async";
import NavBar from "../../common/navbar/NavBar";

function HomeScreen() {
  return (
    <div className="home_screen">
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="nav">
        <NavBar />
      </div>
      <div className="container">
        <div className="home_content"></div>
      </div>
    </div>
  );
}

export default HomeScreen;
