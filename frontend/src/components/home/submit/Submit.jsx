import "./styles.scss";
import s5 from "../../../assets/home/s5.jpeg";
import map from "../../../assets/home/map.png";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../utilities/utils/Utils";
import { toast } from "react-toastify";

function SubmitComponent() {
  const navigate = useNavigate();
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  //========
  //REDIRECT
  //========
  const reportHandler = () => {
    if (!userInfo) {
      toast.error("You need to log in to proceed", {});
      navigate("/login?redirect=/report");
    } else {
      navigate("/report");
    }
  };
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
                <button className="main_btn" onClick={reportHandler}>
                  Report an Issue
                </button>
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
