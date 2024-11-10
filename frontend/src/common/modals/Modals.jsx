import { useAppContext } from "../../utilities/utils/Utils";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import "./styles.scss";
import img from "../../assets/others/p.png";
import TruncateMarkup from "react-truncate-markup";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

export function ReportDetailsModal() {
  const { isModalOpen, handleCloseModal, selectedItem } = useAppContext();

  if (!isModalOpen || !selectedItem) return null;

  return (
    <div>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="item-modal-title"
        aria-describedby="item-modal-description"
        className="item_modal_drawer"
      >
        <Box className="items_menu_modal drawer_modal">
          <div className="drawer_close_icon">
            <span onClick={handleCloseModal} className="span_icon l_flex">
              <CloseIcon className="icon" />
            </span>
          </div>
          <div className="modal_content">
            <div className="image_name_desc_school a_flex">
              <div className="img">
                {selectedItem.privacyPreference === "public" ? (
                  <img
                    src={
                      selectedItem.user?.image ? selectedItem.user.image : img
                    }
                    alt="user image"
                  />
                ) : (
                  <img
                    src={
                      selectedItem.user?.image ? selectedItem.user.image : img
                    }
                    alt="user image"
                  />
                )}
              </div>
              <div className="name_dec">
                <div className="name">
                  {selectedItem.privacyPreference === "public" ? (
                    <h5>
                      {selectedItem.user?.lastName}{" "}
                      {selectedItem.user?.firstName}
                    </h5>
                  ) : (
                    <h5>Anonymous</h5>
                  )}
                </div>
                <div className="desc_school">
                  <small>
                    Reporting about issue of{" "}
                    <span>{selectedItem?.issueType?.join(", ")}</span> in{" "}
                  </small>
                  <div className="school a_flex">
                    <LocationOnOutlinedIcon className="icon" />
                    <small>
                      <p>{selectedItem.schoolName}</p>
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="images a_flex">
              {selectedItem.images?.map((image, idx) => (
                <div className="img" key={idx}>
                  <img src={image} alt={`image ${idx + 1}`} />
                </div>
              ))}
            </div>
            <div className="descriptions">
              <small>
                <p>Description</p>
              </small>
              <TruncateMarkup lines={5}>
                <p>{selectedItem.description}</p>
              </TruncateMarkup>
            </div>
            <div className="suggestions">
              <small>
                <p>Suggestions</p>
              </small>
              <TruncateMarkup lines={5}>
                <p>{selectedItem.comment}</p>
              </TruncateMarkup>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
