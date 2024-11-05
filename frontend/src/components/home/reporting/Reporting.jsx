import "./styles.scss";
import r1 from "../../../assets/home/r1.png";
import r2 from "../../../assets/home/r2.png";
import r3 from "../../../assets/home/r3.png";
import r4 from "../../../assets/home/r4.png";

function Reporting() {
  return (
    <div className="reporting" id="what-we-do">
      <div className="container">
        <div className="content">
          <div className="header">
            <div className="head">
              <h1>
                We don&apos;t just stop at{" "}
                <span className="green"> REPORTING</span>
              </h1>
            </div>
            <div className="text">
              <small>
                <p>
                  We work with you and other stakeholders to ensure every child
                  can access quality basic education. Here is how we do it.
                </p>
              </small>
            </div>
          </div>
          <div className="box">
            <div className="top f_flex">
              <div className="left">
                <div className="head">
                  <h3>Citizen Reporting</h3>
                </div>
                <div className="text">
                  <small>
                    <p>
                      Citizens identify educational challenges in schools around
                      their communities and submit reports through the Edquity
                      Platform. Detailed Information include Location severity,
                      and supporting evidence, is gathered.
                    </p>
                  </small>
                </div>
                <div className="img">
                  <img src={r1} alt="" />
                </div>
              </div>
              <div className="right">
                <div className="head">
                  <h3>Data Verification and Analysis</h3>
                </div>
                <div className="text">
                  <small>
                    <p>
                      Reports are verified to ensure credibility and accuracy
                      Raw data is processed and cleaned to ensure accuracy and
                      consistency. Trends, Patterns and hotspots are identified
                      using advanced analytics tools.
                    </p>
                  </small>
                </div>
                <div className="img">
                  <img src={r2} alt="" />
                </div>
              </div>
            </div>
            <div className="bottom f_flex">
              <div className="left">
                <div className="head">
                  <h3>Data Visualization</h3>
                </div>
                <div className="text">
                  <small>
                    <p>
                      Data is visualized on interactive maps to pinpoint
                      problems areas. User-friendly dashboards provide clear and
                      concise summaries of key findings.
                    </p>
                  </small>
                </div>
                <div className="img">
                  <img src={r3} alt="" />
                </div>
              </div>
              <div className="right">
                <div className="head">
                  <h3>Advocacy and Impact</h3>
                </div>
                <div className="text">
                  <small>
                    <p>
                      Key findings are shared with relevant government agencies
                      and policymakers to inform decision making for quality
                      education delivery. Collaborate with Media outlets to
                      raise awareness and generate public pressure.
                    </p>
                  </small>
                </div>
                <div className="img">
                  <img src={r4} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reporting;
