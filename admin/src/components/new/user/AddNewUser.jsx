import { useReducer, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
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
  loadingCreate: false,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };

    default:
      return state;
  }
};

function AddNewUser() {
  const navigate = useNavigate();

  const { state: appState } = useAppContext(); // Assuming you have a custom hook for app context
  const { userInfo } = appState;

  const [{ loadingCreate }, dispatch] = useReducer(reducer, initialState);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  // UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "CREATE_REQUEST" });
      await axios.post(
        `${request}/api/users/add-user`,
        {
          firstName,
          lastName,
          email,
          role,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );
      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("User created successfully");
      navigate("/users");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  return (
    <div className="product_edit admin_page_all">
      <div className="">
        <div className=" ">
          <div className="productTitleContainer">
            <h3 className="productTitle light_shadow uppercase">
              Add New User
            </h3>
          </div>

          <div className="userEdit">
            <div className="ubottom">
              <div className="right light_shadow">
                <form action="" onSubmit={submitHandler}>
                  <div className="form_group">
                    <div className="formInput">
                      <label htmlFor="">First Name</label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        type="firstName"
                        placeholder="first name"
                      />
                    </div>
                    <div className="formInput">
                      <label htmlFor="">Last Name</label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        type="lastName"
                        placeholder="last name"
                      />
                    </div>
                    <div className="formInput">
                      <label htmlFor="">Email</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="example@mail.com"
                      />
                    </div>
                    <div className="formInput">
                      <label htmlFor="">Password</label>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="text"
                        placeholder="*required format*: e.g SecuredPassword95+ "
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

                  <div className="bottom_btn mt a_flex">
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
                      disabled={loadingCreate}
                    >
                      {loadingCreate ? (
                        <span className="a_flex">
                          <i className="fa fa-spinner fa-spin"></i>
                          Creating...
                        </span>
                      ) : (
                        <>
                          <DescriptionOutlinedIcon className="icon" /> Create
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewUser;
