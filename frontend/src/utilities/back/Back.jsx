import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function BackComponent() {
  const navigate = useNavigate();
  return (
    <div className="back_icon_component">
      <div className="back_btn a_flex" onClick={() => navigate(-1)}>
        <ArrowBackIcon className="icon" />
        <small>Back</small>
      </div>
    </div>
  );
}

export default BackComponent;
