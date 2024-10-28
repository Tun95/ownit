import "./styles.scss";
import banner from "../../../assets/home/banner.jpeg";

function Intro() {
  return (
    <div className="intro_banner">
      <div className="background_banner">
        <img src={banner} alt="" />
      </div>
      <div className="lower_content">
        <div className="container">
          <div className="content">My name</div>
        </div>
      </div>
    </div>
  );
}

export default Intro;
