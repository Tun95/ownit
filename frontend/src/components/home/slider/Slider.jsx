import { useEffect, useReducer, useState } from "react";
import "./styles.scss";
import SliderCard from "./SliderCard";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { getError, useAppContext } from "../../../utilities/utils/Utils";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";
import { ReportDetailsModal } from "../../../common/modals/Modals";

const List = [
  {
    image: "",
    lastName: "John",
    firstName: "Hellena",
    schoolName: "Gwale secondary school",
    images: [
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637278/lkmpkeo33zlwxb3lk3hs.jpg",
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637277/awktvrfpsjkjo9qpeqrn.png",
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637278/lkmpkeo33zlwxb3lk3hs.jpg",
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637277/awktvrfpsjkjo9qpeqrn.png",
    ],
    issueType: "Bullying",
    description:
      "Aliquet ridiculus mi porta habitant vulputate rhoncus, mattis amet enim. Sit purus venenatis velit semper lectus sed ornare quam nulla. Lacus, ut congue sagittis vel nisi integer imperdiet a vitae.",
  },
  {
    image: "",
    lastName: "John",
    firstName: "Hellena",
    schoolName: "Gwale secondary school",
    images: [
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637278/lkmpkeo33zlwxb3lk3hs.jpg",
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637277/awktvrfpsjkjo9qpeqrn.png",
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637278/lkmpkeo33zlwxb3lk3hs.jpg",
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637277/awktvrfpsjkjo9qpeqrn.png",
    ],
    issueType: "Bullying",
    description:
      "Aliquet ridiculus mi porta habitant vulputate rhoncus, mattis amet enim. Sit purus venenatis velit semper lectus sed ornare quam nulla. Lacus, ut congue sagittis vel nisi integer imperdiet a vitae.",
  },
  {
    image: "",
    lastName: "John",
    firstName: "Hellena",
    schoolName: "Gwale secondary school",
    images: [
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637278/lkmpkeo33zlwxb3lk3hs.jpg",
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637277/awktvrfpsjkjo9qpeqrn.png",
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637278/lkmpkeo33zlwxb3lk3hs.jpg",
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637277/awktvrfpsjkjo9qpeqrn.png",
    ],
    issueType: "Bullying",
    description:
      "Aliquet ridiculus mi porta habitant vulputate rhoncus, mattis amet enim. Sit purus venenatis velit semper lectus sed ornare quam nulla. Lacus, ut congue sagittis vel nisi integer imperdiet a vitae.",
  },
  {
    image: "",
    lastName: "John",
    firstName: "Hellena",
    schoolName: "Gwale secondary school",
    images: [
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637278/lkmpkeo33zlwxb3lk3hs.jpg",
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637277/awktvrfpsjkjo9qpeqrn.png",
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637278/lkmpkeo33zlwxb3lk3hs.jpg",
      "https://res.cloudinary.com/dtvwnonbi/image/upload/v1730637277/awktvrfpsjkjo9qpeqrn.png",
    ],
    issueType: "Bullying",
    description:
      "Aliquet ridiculus mi porta habitant vulputate rhoncus, mattis amet enim. Sit purus venenatis velit semper lectus sed ornare quam nulla. Lacus, ut congue sagittis vel nisi integer imperdiet a vitae.",
  },
];

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, reports: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function SliderComponent() {
  const navigate = useNavigate();

  const [{ loading, error, reports }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    reports: [],
  });

  const { state: appState, handleOpenModal } = useAppContext();
  const { userInfo } = appState;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`${request}/api/reports`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
        console.log(getError(err));
      }
    };

    fetchData();
  }, []);

  //=============
  // REACT SLICK
  //=============
  const [slidesToShow, setSlidesToShow] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1250) {
        setSlidesToShow(Math.min(3, reports.length));
      } else if (screenWidth >= 900) {
        setSlidesToShow(Math.min(2, reports.length));
      } else if (screenWidth >= 300) {
        setSlidesToShow(Math.min(1, reports.length));
      } else {
        setSlidesToShow(Math.min(1, reports.length));
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [reports.length]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    autoplay: false,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
  };
  return (
    <>
      <div className="slider">
        <div className="container">
          <div className="content">
            <div className="header">
              <div className="head">
                <h1>Reports from other Champions</h1>
              </div>
            </div>
            <div className="card_box f_flex">
              <div className="left ">
                <div className="text_btn l_flex">
                  <div className="text">
                    <h3>
                      Join over 50+ Champions taking up the initiative to
                      transform education
                    </h3>
                  </div>
                  {!userInfo && (
                    <div className="btn">
                      <button
                        className="main_btn"
                        onClick={() => navigate("/register")}
                      >
                        <small>Register</small>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="right">
                {List?.length === 0 && (
                  <div className="no_review l_flex">
                    <p>No Reports Found</p>
                  </div>
                )}
                {loading ? (
                  <LoadingBox></LoadingBox>
                ) : error ? (
                  <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                  <div className="slider_cards">
                    {" "}
                    <Slider {...settings} className="slick_slider">
                      {reports?.map((item, index) => (
                        <span key={index} onClick={() => handleOpenModal(item)}>
                          <SliderCard item={item} index={index} />
                        </span>
                      ))}
                    </Slider>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReportDetailsModal />
    </>
  );
}

export default SliderComponent;
