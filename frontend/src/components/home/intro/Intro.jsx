import "./styles.scss";
import banner from "../../../assets/home/banner.jpeg";
import s1 from "../../../assets/home/s4.png";
import { useAppContext } from "../../../utilities/utils/Utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Intro() {
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
    <div className="intro_banner">
      <div className="lower_content c_flex">
        <div className="container">
          <div className="content c_flex">
            <div className="left">
              <div className="title">
                <h1>
                  Own the Change Make Public Schools Better with{" "}
                  <span className="green">Edquity</span>
                </h1>
              </div>
              <div className="desc_text">
                <small>
                  <p>
                    Spotted an issue in your local school? Whether it&apos;s
                    broken infrastructure, overcrowded classrooms, e.t.c Edquity
                    helps you report it so the right authorities can take
                    action.
                  </p>
                </small>
              </div>
              <div className="btn">
                <button className="main_btn" onClick={reportHandler}>
                  <small>Report an Issue</small>
                </button>
              </div>
            </div>
            <div className="right f_flex">
              <div className="img">
                <img src={s1} alt="image" />
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="background_banner">
        <img src={banner} alt="" />
      </div>
    </div>
  );
}

export default Intro;
