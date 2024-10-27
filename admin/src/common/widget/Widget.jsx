import "./widget.scss";
import PropTypes from "prop-types";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import EventNoteIcon from "@mui/icons-material/EventNote";

// Format numbers with commas (e.g., 2,300,454)
const formatNumberWithCommas = (num) => {
  const validNumber = isNaN(num) || num === null || num === undefined ? 0 : num; // Fallback to 0 if num is invalid
  return validNumber.toLocaleString(); // Format the number with commas
};

const Widget = ({
  type,
  TotalUsers = 0,
  TotalReports = 0,
  TotalApproved = 0,
  TotalPending = 0,
  TotalDisapproved = 0,
  TotalDailyCheckIns = 0,
  TotalDailyCheckOuts = 0,
}) => {
  let data;

  // Determine the amount based on the type prop
  const dataType =
    type === "user"
      ? TotalUsers
      : type === "reports"
      ? TotalReports
      : type === "approved"
      ? TotalApproved
      : type === "pending"
      ? TotalPending
      : type === "disapproved"
      ? TotalDisapproved
      : type === "checkIns"
      ? TotalDailyCheckIns
      : type === "checkOuts"
      ? TotalDailyCheckOuts
      : 0;

  // Switch statement to handle different widget types
  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "Number of users",
        icon: (
          <PersonOutlineOutlinedIcon
            className="icon"
            style={{ color: "crimson", backgroundColor: "rgba(255,0,0,0.2)" }}
          />
        ),
      };
      break;
    case "reports":
      data = {
        title: "REPORTS",
        isMoney: false,
        link: "Total reports submitted",
        icon: (
          <EventNoteIcon
            className="icon"
            style={{
              color: "goldenrod",
              backgroundColor: "rgba(218,165,32,0.2)",
            }}
          />
        ),
      };
      break;
    case "approved":
      data = {
        title: "APPROVED REPORTS",
        isMoney: false,
        link: "All approved reports",
        icon: (
          <VerifiedUserIcon
            className="icon"
            style={{ color: "green", backgroundColor: "rgba(0,128,0,0.2)" }}
          />
        ),
      };
      break;
    case "pending":
      data = {
        title: "PENDING REPORTS",
        isMoney: false,
        link: "All pending reports",
        icon: (
          <FactCheckIcon
            className="icon"
            style={{ color: "orange", backgroundColor: "rgba(255,165,0,0.2)" }}
          />
        ),
      };
      break;
    case "disapproved":
      data = {
        title: "DISAPPROVED REPORTS",
        isMoney: false,
        link: "All disapproved reports",
        icon: (
          <FactCheckIcon
            className="icon"
            style={{ color: "red", backgroundColor: "rgba(255,0,0,0.2)" }}
          />
        ),
      };
      break;
    case "checkIns":
      data = {
        title: "CHECKED IN'S",
        isMoney: false,
        link: "All check In's",
        icon: (
          <FactCheckIcon
            className="icon"
            style={{ color: "purple", backgroundColor: "rgba(128,0,128,0.2)" }}
          />
        ),
      };
      break;
    case "checkOuts":
      data = {
        title: "CHECKED OUTS",
        isMoney: false,
        link: "All check Outs",
        icon: (
          <FactCheckIcon
            className="icon"
            style={{ color: "crimson", backgroundColor: "rgba(255,0,0,0.2)" }}
          />
        ),
      };
      break;
    default:
      data = undefined;
      break;
  }

  if (!data) return null; // Handle invalid type

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney
            ? `$${dataType.toLocaleString()}`
            : formatNumberWithCommas(dataType)}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          {/* Placeholder for percentage change */}
        </div>
        {data.icon}
      </div>
    </div>
  );
};

Widget.propTypes = {
  type: PropTypes.oneOf([
    "user",
    "reports",
    "approved",
    "pending",
    "disapproved",
    "checkIns",
    "checkOuts",
  ]).isRequired,
  TotalUsers: PropTypes.number,
  TotalReports: PropTypes.number,
  TotalApproved: PropTypes.number,
  TotalPending: PropTypes.number,
  TotalDisapproved: PropTypes.number,
  TotalDailyCheckIns: PropTypes.number,
  TotalDailyCheckOuts: PropTypes.number,
};

export default Widget;
