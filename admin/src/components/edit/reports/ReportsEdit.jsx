import { useEffect, useReducer, useState } from "react";
import "../styles/styles.scss";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloseIcon from "@mui/icons-material/Close";
//import photo from "../../../assets/others/photo.jpg";
import { request } from "../../../base url/BaseUrl";
import { getError, useAppContext } from "../../../utilities/utils/Utils";
import ReactPlayer from "react-player";
import PhotoViewer from "photoviewer";
import SearchIcon from "@mui/icons-material/Search";
import Slider from "react-slick";

const statusListOptions = ["pending", "approved", "disapproved"];

// Slider settings
const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
};

// Initial state and action types for reducer
const initialState = {
  report: {},
  loading: true,
  error: "",
  loadingUpload: false,
  loadingUpdate: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, report: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, error: action.payload };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, error: action.payload };
    default:
      return state;
  }
};

function ReportsEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: reportId } = params;

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [{ report, loadingUpdate }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const [status, setStatus] = useState("");

  // Fetch report data
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/reports/${reportId}`);
        setStatus(data.status);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [reportId]);

  // Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const updatedReport = {
        status,
      };

      await axios.put(`${request}/api/reports/${reportId}`, updatedReport, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Report updated successfully");
      // navigate("/reports");
    } catch (err) {
      toast.error(getError(err));
      dispatch({
        type: "UPDATE_FAIL",
        payload: getError(err),
      });
    }
  };

  // Handle image click to open PhotoViewer
  const openPhotoViewer = (images, index) => {
    const photoViewerOptions = {
      index: index,
      title: true,
    };
    const photoViewer = new PhotoViewer(images, photoViewerOptions);
    photoViewer.show();
  };

  console.log(report.images);
  return (
    <>
      <Helmet>
        <title>Edit Report :: {report ? `${report.schoolName}` : ""}</title>
      </Helmet>
      <div className="product_edit admin_page_all">
        <div className="">
          <div className=" ">
            <div className="productTitleContainer">
              <h3 className="productTitle light_shadow uppercase">
                Edit Report
              </h3>
            </div>
            <div className="productBottom mtb">
              <form action="" onSubmit={submitHandler}>
                <div className="productForm">
                  <div className="product_info product___">
                    <div className="light_shadow product___main">
                      <div className={"header  c_flex"}>
                        <div className="left">
                          <div className="d_flex">
                            <div className="number l_flex">
                              <span>01</span>
                            </div>
                            <div className="text">
                              <h4>Report Info</h4>
                              <small>Fill all report information below</small>
                            </div>
                          </div>
                        </div>
                        <div className="right">
                          <KeyboardArrowUpIcon className="icon" />
                        </div>
                      </div>
                      <>
                        <div className="product_chart_info f_flex">
                          <div className="product_right light_shadow">
                            <table className="productTable">
                              <tbody>
                                <tr className="product_img_text f_flex">
                                  <td className="imageCell l_flex">
                                    <div className="images">
                                      <div className="style_img">
                                        <Slider
                                          {...settings}
                                          className="large_img"
                                        >
                                          {report?.images?.map(
                                            (image, index) => (
                                              <div
                                                key={index}
                                                className="img_large"
                                                onClick={() =>
                                                  openPhotoViewer(
                                                    report.images.map(
                                                      (img) => ({ src: img })
                                                    ),
                                                    index
                                                  )
                                                }
                                              >
                                                <img
                                                  src={image}
                                                  alt={`Image ${index}`}
                                                />
                                              </div>
                                            )
                                          )}
                                        </Slider>
                                        <div
                                          className="icon_search l_flex"
                                          onClick={() => {
                                            if (report?.images?.length) {
                                              openPhotoViewer(
                                                report.images.map((image) => ({
                                                  src: image,
                                                })),
                                                0 // Open the first image by default or handle based on your requirement
                                              );
                                            }
                                          }}
                                        >
                                          <SearchIcon className="icon" />
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="textCell f_flex">
                                    <div>
                                      <label htmlFor="schoolName">
                                        School Name:
                                      </label>
                                      <span>{report?.schoolName}</span>
                                    </div>{" "}
                                    <div>
                                      <label htmlFor="schoolLocation">
                                        School Location:
                                      </label>
                                      <span>{report?.schoolLocation}</span>
                                    </div>
                                    <div>
                                      <label htmlFor="slug">Slug:</label>
                                      <span>{report?.slug}</span>
                                    </div>
                                    <div>
                                      <label htmlFor="issueType">
                                        Issue Type:
                                      </label>
                                      <span>
                                        {report?.issueType?.join(", ")}
                                      </span>
                                    </div>
                                    <div>
                                      <label htmlFor="status">Status:</label>
                                      <span>{report?.status}</span>
                                    </div>
                                    <div>
                                      <label htmlFor="user">
                                        Submitted By:
                                      </label>
                                      <span>
                                        {report?.user?.lastName}{" "}
                                        {report?.user?.firstName}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>{" "}
                        <div className="video_content">
                          <ReactPlayer
                            url={report.video}
                            controls={true}
                            width="100%"
                            height="auto"
                          />
                        </div>
                        <div className="status_box box">
                          <div className="form-group">
                            <label htmlFor="status">Status: </label>
                            <select
                              name="status"
                              className="select"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)} // Add onChange handler
                            >
                              <option value="" disabled>
                                Approval Status
                              </option>
                              {statusListOptions.map((item, index) => (
                                <option value={item} key={index}>
                                  {item.charAt(0).toUpperCase() + item.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="product_info_box box">
                          <div className="form-group">
                            <label htmlFor="description">Description: </label>
                            <small>
                              <p>{report?.description}</p>
                            </small>
                          </div>
                          <div className="form-group">
                            <label htmlFor="comment">Comment: </label>
                            <small>
                              <p>{report?.comment}</p>
                            </small>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
                <div className="bottom_btn mtb">
                  <span className="a_flex">
                    <button
                      className=" a_flex"
                      onClick={() => navigate("/reports")}
                    >
                      <CloseIcon className="icon" /> Cancel
                    </button>
                    <button
                      type="submit"
                      className="a_flex"
                      disabled={loadingUpdate}
                    >
                      {loadingUpdate ? (
                        <span className="a_flex">
                          <i className="fa fa-spinner fa-spin"></i>
                          Saving...
                        </span>
                      ) : (
                        <>
                          <DescriptionOutlinedIcon className="icon" /> Save
                        </>
                      )}
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportsEdit;
