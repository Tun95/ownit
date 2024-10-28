import "./styles.scss";
import s3 from "../../../assets/home/s3.png";

function Intiative() {
  return (
    <div className="initiative">
      <div className="container">
        <div className="content">
          {" "}
          <div className="header">
            <div className="head">
              <h1>
                Be part of this <span className="green">initiative</span> in 3
                simple steps
              </h1>
            </div>
          </div>
          <div className="lower_list_img c_flex">
            <div className="list_btn">
              <div className="list">
                {" "}
                <ul>
                  <li className="f_flex">
                    <div className="count l_flex">01</div>
                    <div className="head_text">
                      <div className="head">
                        <h3>Spot an issue</h3>
                      </div>
                      <div className="text">
                        <p>
                          Observe and identify educational challenges in your
                          community school.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="f_flex">
                    <div className="count l_flex">02</div>
                    <div className="head_text">
                      <div className="head">
                        <h3>Document the issue</h3>
                      </div>
                      <div className="text">
                        <p>
                          Collect relevant details including location, date and
                          specific evidence (e.g photo, video, witness account).
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="f_flex">
                    <div className="count l_flex">03</div>
                    <div className="head_text">
                      <div className="head">
                        <h3>Report the issue</h3>
                      </div>
                      <div className="text">
                        <p>Input the information and submit</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="btn">
                <button className="main_btn">
                  <small>Report an Issue</small>
                </button>
              </div>
            </div>
            <div className="img">
              <img src={s3} alt="mobile_image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intiative;
