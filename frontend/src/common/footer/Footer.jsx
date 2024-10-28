import "./styles.scss";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="content c_flex">
          <div className="left">
            <small>Ownit by Bridge Connect Arica </small>
          </div>
          <div className="right">
            <div className="icons a_flex">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="l_flex"
              >
                <FacebookOutlinedIcon className="icon" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="l_flex"
              >
                <InstagramIcon className="icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
