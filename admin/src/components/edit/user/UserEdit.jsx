import { useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import "./styles.scss";
import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";
import { request } from "../../../base url/BaseUrl";
import { getError, useAppContext } from "../../../utilities/utils/Utils";
import CloseIcon from "@mui/icons-material/Close";

const roleList = [
  { name: "Admin", value: "admin" },
  { name: "User", value: "user" },
  { name: "Government", value: "government" },
];

// Initial State
const initialState = {
  loading: true,
  loadingUpdate: false,
  loadingImageUpload: false,
  error: "",
  user: undefined,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    // Image Upload States
    case "UPLOAD_IMAGE_REQUEST":
      return { ...state, loadingImageUpload: true };
    case "UPLOAD_IMAGE_SUCCESS":
    case "UPLOAD_IMAGE_FAIL":
      return { ...state, loadingImageUpload: false };

    default:
      return state;
  }
};

function UserEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: userId } = params;

  const { state: appState } = useAppContext(); // Assuming you have a custom hook for app context
  const { userInfo } = appState;

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // FETCHING
  const fetchData = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.get(`${request}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });

      setEmail(data.email);

      setRole(data.role || "");

      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, userInfo]);

  // UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${request}/api/users/${userId}`,
        {
          _id: userId,
          email,
          role,
        },
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      fetchData();
      toast.success("User updated successfully or/and Email sent successfully");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  return (
    <div className="product_edit admin_page_all">
      <div className="">
        <div className=" ">
          <div className="productTitleContainer">
            <h3 className="productTitle light_shadow uppercase">
              Edit User Info
            </h3>
          </div>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <div className="userEdit">
              <div className="ubottom">
                <div className="right light_shadow">
                  <form action="" onSubmit={submitHandler}>
                    <div className="form_group">
                      <div className="formInput">
                        <label htmlFor="">Email</label>
                        <input
                          value={email}
                          // disabled={user?.isAdmin}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          placeholder="tunji@gmail.com"
                        />
                      </div>

                      {/* ROLES */}
                      <div className="formInput">
                        <label htmlFor="role">Role</label>
                        <select
                          name="role"
                          className="select"
                          id="role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value="" disabled>
                            Select Role
                          </option>
                          {roleList.map((item, index) => (
                            <option value={item.value} key={index}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="bottom_btn a_flex">
                      {" "}
                      <button
                        className="cancel a_flex"
                        onClick={() => navigate("/users")}
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
                            <DescriptionOutlinedIcon className="icon" /> Save &
                            Send
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserEdit;
