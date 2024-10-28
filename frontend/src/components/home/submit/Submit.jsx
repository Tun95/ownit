import "./styles.scss";
import s5 from "../../../assets/home/s5.jpeg";
import map from "../../../assets/home/map.png";

function SubmitComponent() {
  return (
    <div className="submit_component">
      <div className="container">
        <div className="content">
          <div className="header">
            <div className="head_btn">
              <div className="head_">
                <h1>
                  Join other active citizens who are making a brighter future
                  possible for every child
                </h1>
              </div>{" "}
              <div className="btn l_flex">
                <button className="main_btn">Report an Issue</button>
              </div>
            </div>
          </div>
          <div className="gradient"></div>
          <div className="img_bg_background">
            <div className="img">
              {" "}
              <img src={s5} alt="background" />
            </div>
          </div>
          <div className="img_map l_flex">
            <img src={map} alt="map_bg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitComponent;
