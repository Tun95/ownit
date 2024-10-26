import { useEffect, useReducer, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import "../styles/styles.scss";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Checkbox } from "antd";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloseIcon from "@mui/icons-material/Close";
import photo from "../../../assets/others/photo.jpg";
import { request } from "../../../base url/BaseUrl";
import { getError, useAppContext } from "../../../utilities/utils/Utils";

const formatDate = (dateStr) => {
  if (!dateStr || isNaN(new Date(dateStr).getTime())) {
    return ""; // Return an empty string if the date is invalid or undefined
  }

  const date = new Date(dateStr);
  return date.toISOString().slice(0, 16); // Format to YYYY-MM-DDTHH:MM
};

// Initial state and action types for reducer
const initialState = {
  event: {},
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
      return { ...state, loading: false, event: action.payload };
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
  const editor = useRef(null);
  const navigate = useNavigate();
  const params = useParams();
  const { id: eventId } = params;

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [{ event, loadingUpdate, loadingUpload }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [banner, setBanner] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [location, setLocation] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //==================
  // TOGGLE TIME BOX
  //==================
  const [dayTimesData, setDayTimesData] = useState([
    { day: "", start: "", end: "" },
  ]); // Initialize with one empty object

  // Add a new empty DayTime
  const addMoreDayTimes = () => {
    setDayTimesData([...dayTimesData, { day: "", start: "", end: "" }]);
  };

  // Delete DayTime by index
  const deleteDayTimes = (index) => {
    const updatedDayTimesData = [...dayTimesData];
    updatedDayTimesData.splice(index, 1);
    setDayTimesData(updatedDayTimesData);
  };

  // Fetch event data
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/events/${eventId}`);
        setTitle(data.title);
        setDescription(data.description);
        setFeatured(data.featured);
        setLocation(data.location);
        setStartingDate(formatDate(data.startingDate));
        setEndDate(formatDate(data.endDate));
        setImage(data.image);
        setBanner(data.banner);
        setDayTimesData(data.dayTimes || []);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [eventId]);

  // Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const cleanedDayTimesData = dayTimesData.filter((dayTimes) => {
        return (
          dayTimes.day.trim() !== "" ||
          dayTimes.start.trim() !== "" ||
          dayTimes.end.trim() !== ""
        );
      });

      const updatedEvent = {
        title,
        description,
        featured,
        location,
        startingDate,
        endDate,
        dayTimes: cleanedDayTimesData,
        image,
        banner,
      };

      await axios.put(`${request}/api/events/${eventId}`, updatedEvent, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Event updated successfully");
      // navigate("/bills");
    } catch (err) {
      toast.error(getError(err));
      dispatch({
        type: "UPDATE_FAIL",
        payload: getError(err),
      });
    }
  };

  // Image upload handler
  const uploadFileHandler = async (e, isBanner) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(`${request}/api/upload`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      if (isBanner) {
        setBanner(data.secure_url); // Set the banner image
      } else {
        setImage(data.secure_url); // Set the general image
      }
      toast.success("Image uploaded successfully. Click save to apply it");
    } catch (err) {
      toast.error(getError(err));
      dispatch({
        type: "UPLOAD_FAIL",
        payload: getError(err),
      });
    }
  };

  //============
  // TOGGLE BOX
  //============
  const [openBox, setOpenBox] = useState(null);

  // Define the type for the index parameter
  const toggleBox = (index) => {
    if (openBox === index) {
      setOpenBox(null);
    } else {
      setOpenBox(index);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit Event :: {event ? `${event.title}` : ""}</title>{" "}
      </Helmet>
      <div className="product_edit admin_page_all">
        <div className="">
          <div className=" ">
            <div className="productTitleContainer">
              <h3 className="productTitle light_shadow uppercase">
                Edit Event
              </h3>
            </div>
            <div className="productBottom mtb">
              <form action="" onSubmit={submitHandler}>
                <div className="productForm">
                  <div className="product_info product___">
                    <div className="light_shadow product___main">
                      <div
                        className={
                          openBox === 0
                            ? "header  c_flex"
                            : "header border c_flex"
                        }
                        onClick={() => toggleBox(0)}
                      >
                        <div className="left">
                          <div className="d_flex">
                            <div className="number l_flex">
                              <span>01</span>
                            </div>
                            <div className="text">
                              <h4>Event Info</h4>
                              <small>Fill all event information below</small>
                            </div>
                          </div>
                        </div>
                        <div className="right">
                          {openBox === 0 ? (
                            <KeyboardArrowUpIcon className="icon" />
                          ) : (
                            <KeyboardArrowDownIcon className="icon" />
                          )}
                        </div>
                      </div>
                      {openBox === 0 && (
                        <>
                          <div className="product_chart_info f_flex">
                            <div className="product_right light_shadow">
                              <table className="productTable">
                                <tbody>
                                  <tr className="product_img_text">
                                    <td className="imageCell l_flex">
                                      <div className="productImg ">
                                        <img
                                          src={
                                            event?.image ? event?.image : photo
                                          }
                                          alt=""
                                          className="img"
                                        />
                                      </div>
                                    </td>
                                    <td className="textCell">
                                      <div>
                                        <label htmlFor="title">Title:</label>
                                        <span>{event?.title}</span>
                                      </div>
                                      <div>
                                        <label htmlFor="slug">Slug:</label>
                                        <span>{event?.slug}</span>
                                      </div>
                                      <div>
                                        <label htmlFor="expirationDate">
                                          Start On:
                                        </label>
                                        <span>
                                          {formatDate(event?.startingDate)}
                                        </span>
                                      </div>
                                      <div>
                                        <label htmlFor="expirationDate">
                                          Ends On:
                                        </label>
                                        <span>
                                          {formatDate(event?.endDate)}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="product_info_box box">
                            <div className="form-group">
                              <label htmlFor="title">Title</label>
                              <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Event title"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="location">Location</label>
                              <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g Lagos"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="startingDate">
                                Starting Date
                              </label>
                              <input
                                type="datetime-local"
                                id="startingDate"
                                value={startingDate}
                                onChange={(e) =>
                                  setStartingDate(e.target.value)
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="endDate">End Date</label>
                              <input
                                type="datetime-local"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                              />
                            </div>

                            {/* FEATURED */}
                            <div className="form-group a_flex black_friday">
                              <Checkbox
                                checked={featured}
                                onChange={() =>
                                  setFeatured((prevValue) => !prevValue)
                                }
                              >
                                Featured
                              </Checkbox>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {/* DAY TIMES */}
                    <div className="light_shadow mt product_color">
                      <div
                        className={
                          openBox === 1
                            ? "header  c_flex"
                            : "header border c_flex"
                        }
                        onClick={() => toggleBox(1)}
                      >
                        <div className="left">
                          <div className="d_flex">
                            <div className="number l_flex">
                              <span>02</span>
                            </div>
                            <div className="text">
                              <h4>Event Hours</h4>
                              <small>Add event hours</small>
                            </div>
                          </div>
                        </div>
                        <div className="right">
                          {openBox === 1 ? (
                            <KeyboardArrowUpIcon className="icon" />
                          ) : (
                            <KeyboardArrowDownIcon className="icon" />
                          )}
                        </div>
                      </div>
                      {openBox === 1 && (
                        <div className="product_info_color">
                          <div className="product_info_box box">
                            {dayTimesData.map((dayTimes, dayTimesIndex) => (
                              <div className="form-group" key={dayTimesIndex}>
                                <label htmlFor="dayTimes">Day</label>
                                <span className="specification_name">
                                  <input
                                    type="text"
                                    id="dayTimes"
                                    value={dayTimes.day}
                                    onChange={(e) => {
                                      const updatedDayTimesData = [
                                        ...dayTimesData,
                                      ];
                                      updatedDayTimesData[dayTimesIndex].day =
                                        e.target.value;
                                      setDayTimesData(updatedDayTimesData);
                                    }}
                                    placeholder="e.g Day One"
                                  />
                                </span>
                                <span className="link_img">
                                  <label htmlFor="dayTimes">Start</label>
                                  <input
                                    type="time"
                                    id="dayTimes"
                                    value={dayTimes.start}
                                    onChange={(e) => {
                                      const updatedDayTimesData = [
                                        ...dayTimesData,
                                      ];
                                      updatedDayTimesData[dayTimesIndex].start =
                                        e.target.value;
                                      setDayTimesData(updatedDayTimesData);
                                    }}
                                    placeholder="time"
                                  />
                                </span>
                                <span className="link_img">
                                  <label htmlFor="dayTimes">End</label>
                                  <input
                                    type="time"
                                    id="dayTimes"
                                    value={dayTimes.end}
                                    onChange={(e) => {
                                      const updatedDayTimesData = [
                                        ...dayTimesData,
                                      ];
                                      updatedDayTimesData[dayTimesIndex].end =
                                        e.target.value;
                                      setDayTimesData(updatedDayTimesData);
                                    }}
                                    placeholder="time"
                                  />
                                </span>
                                {dayTimesData.length > 1 && (
                                  <button
                                    type="button"
                                    className="remove_btn a_flex first_btn next_del_btn"
                                    onClick={() =>
                                      deleteDayTimes(dayTimesIndex)
                                    }
                                  >
                                    <span className="a_flex">
                                      <CloseIcon className="icon" />
                                      Delete Time
                                    </span>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="add_more_btn">
                            <span onClick={addMoreDayTimes}>Add More Time</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* EVENT IMAGE UPLOAD */}
                    <div className="light_shadow mt product_images banners">
                      <div
                        className={
                          openBox === 2
                            ? "header  c_flex"
                            : "header border c_flex"
                        }
                        onClick={() => toggleBox(2)}
                      >
                        <div className="left">
                          <div className="d_flex">
                            <div className="number l_flex">
                              <span>03</span>
                            </div>
                            <div className="text">
                              <h4>Event Image</h4>
                              <small>Upload event image</small>
                            </div>
                          </div>
                        </div>
                        <div className="right">
                          {openBox === 2 ? (
                            <KeyboardArrowUpIcon className="icon" />
                          ) : (
                            <KeyboardArrowDownIcon className="icon" />
                          )}
                        </div>
                      </div>
                      {openBox === 2 && (
                        <div className="product_info_images">
                          <div className="product_info_img_box box">
                            <div className="form_group f_flex">
                              <div className="drop_zone">
                                <img
                                  src={image ? image : photo}
                                  alt="Banner"
                                  className="images"
                                />
                                <div className="icon_bg l_flex">
                                  <label
                                    htmlFor="files"
                                    className={
                                      loadingUpload
                                        ? "upload_box disabled l_flex"
                                        : "upload_box l_flex"
                                    }
                                  >
                                    {loadingUpload ? (
                                      <i className="fa fa-spinner fa-spin"></i>
                                    ) : (
                                      <label>
                                        <div className="inner">
                                          <div className="icon_btn">
                                            <CloudUploadIcon
                                              className={
                                                image ? "icon white" : "icon"
                                              }
                                            />
                                          </div>
                                        </div>
                                        <input
                                          style={{ display: "none" }}
                                          type="file"
                                          id="electionImage"
                                          onChange={(e) =>
                                            uploadFileHandler(e, false)
                                          } // false for general image
                                        />
                                      </label>
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* EVENT BANNER UPLOAD */}
                    <div className="light_shadow mt product_images banners">
                      <div
                        className={
                          openBox === 3
                            ? "header  c_flex"
                            : "header border c_flex"
                        }
                        onClick={() => toggleBox(3)}
                      >
                        <div className="left">
                          <div className="d_flex">
                            <div className="number l_flex">
                              <span>04</span>
                            </div>
                            <div className="text">
                              <h4>Event Banner</h4>
                              <small>Upload event banner</small>
                            </div>
                          </div>
                        </div>
                        <div className="right">
                          {openBox === 3 ? (
                            <KeyboardArrowUpIcon className="icon" />
                          ) : (
                            <KeyboardArrowDownIcon className="icon" />
                          )}
                        </div>
                      </div>
                      {openBox === 3 && (
                        <div className="product_info_images">
                          <div className="product_info_img_box box">
                            <div className="form_group f_flex">
                              <div className="drop_zone">
                                <img
                                  src={banner ? banner : photo}
                                  alt="Banner"
                                  className="images"
                                />
                                <div className="icon_bg l_flex">
                                  <label
                                    htmlFor="files"
                                    className={
                                      loadingUpload
                                        ? "upload_box disabled l_flex"
                                        : "upload_box l_flex"
                                    }
                                  >
                                    {loadingUpload ? (
                                      <i className="fa fa-spinner fa-spin"></i>
                                    ) : (
                                      <label>
                                        <div className="inner">
                                          <div className="icon_btn">
                                            <CloudUploadIcon
                                              className={
                                                banner ? "icon white" : "icon"
                                              }
                                            />
                                          </div>
                                        </div>
                                        <input
                                          style={{ display: "none" }}
                                          type="file"
                                          id="banner"
                                          onChange={(e) =>
                                            uploadFileHandler(e, true)
                                          } // true for banner
                                        />
                                      </label>
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* BILL DESCRIPTION */}
                    <div className="light_shadow mt product_description">
                      <div
                        className={
                          openBox === 4
                            ? "header  c_flex"
                            : "header border c_flex"
                        }
                        onClick={() => toggleBox(4)}
                      >
                        <div className="left">
                          <div className="d_flex">
                            <div className="number l_flex">
                              <span>05</span>
                            </div>
                            <div className="text">
                              <h4>Event Description</h4>
                              <small>Provide detailed event description</small>
                            </div>
                          </div>
                        </div>
                        <div className="right">
                          {openBox === 4 ? (
                            <KeyboardArrowUpIcon className="icon" />
                          ) : (
                            <KeyboardArrowDownIcon className="icon" />
                          )}
                        </div>
                      </div>
                      {openBox === 4 && (
                        <div className="product_info_desc box">
                          <div className="form-group">
                            <label htmlFor="">Description</label>
                            <JoditEditor
                              className="editor"
                              ref={editor}
                              value={description}
                              onBlur={(newContent) =>
                                setDescription(newContent)
                              } // preferred to use only this option to update the content for performance reasons
                            />
                          </div>
                        </div>
                      )}
                    </div>{" "}
                  </div>
                </div>
                <div className="bottom_btn mtb">
                  <span className="a_flex">
                    <button
                      className=" a_flex"
                      onClick={() => navigate("/events")}
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
