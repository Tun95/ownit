import PropTypes from "prop-types";
import img from "../../../assets/others/p.png";
import TruncateMarkup from "react-truncate-markup";

function SliderCard({ item, index }) {
  return (
    <>
      {" "}
      <div className="slider_card" key={index}>
        <div className="slider_content">
          <div className="image_name_desc_school a_flex">
            <div className="img">
              {item.privacyPreference === "public" ? (
                <img
                  src={item.user?.image ? item.user.image : img}
                  alt="user image"
                />
              ) : (
                <img
                  src={item.user?.image ? item.user.image : img}
                  alt="user image"
                />
              )}
            </div>
            <div className="name_dec">
              <div className="name">
                {item.privacyPreference === "public" ? (
                  <h5>
                    {item.user?.lastName} {item.user?.firstName}
                  </h5>
                ) : (
                  <h5>Anonymous</h5>
                )}
              </div>
              <div className="desc_school">
                <small>
                  Reporting about issue of{" "}
                  <span>{item?.issueType?.join(", ")}</span> in{" "}
                  <span>{item.schoolName}</span>.
                </small>
              </div>
            </div>
          </div>
          <div className="images a_flex">
            {item.images?.slice(0, 3).map((image, idx) => (
              <div className="img" key={idx}>
                <img src={image} alt={`image ${idx + 1}`} />
              </div>
            ))}
          </div>
          <div className="descriptions">
            <TruncateMarkup lines={3}>
              <p>{item.description}</p>
            </TruncateMarkup>
          </div>
        </div>
      </div>
    </>
  );
}

SliderCard.propTypes = {
  item: PropTypes.shape({
    user: PropTypes.shape({
      image: PropTypes.string,
      lastName: PropTypes.string,
      firstName: PropTypes.string,
    }),
    issueType: PropTypes.arrayOf(PropTypes.string),
    privacyPreference: PropTypes.string,
    schoolName: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
  }),
  index: PropTypes.number,
};

export default SliderCard;
