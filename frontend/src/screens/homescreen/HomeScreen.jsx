import { Helmet } from "react-helmet-async";

function HomeScreen() {
  return (
    <div className="home_screen">
      <Helmet>
        <title>Home</title>
      </Helmet>

      <div className="container">
        <div className="home_content"></div>
      </div>
    </div>
  );
}

export default HomeScreen;
