import { useEffect, useReducer } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styles.scss";
import axios from "axios";
import { toast } from "react-toastify";
import { getError, useAppContext } from "../../../utilities/utils/Utils";
import { request } from "../../../base url/BaseUrl";
import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";
import ReactTimeAgo from "react-time-ago";

const columns = [
  { field: "_id", headerName: "ID", width: 230 },
  { field: "email", headerName: "Email", width: 230 },
  {
    field: "createdAt",
    headerName: "Date",
    width: 130,
    renderCell: (params) => {
      return (
        <>
          <div className="cellWidthImg">
            <ReactTimeAgo
              date={Date.parse(params.row.createdAt)}
              locale="en-US"
            />
          </div>
        </>
      );
    },
  },
  {
    field: "isAdmin",
    headerName: "isAdmin",
    width: 100,
    renderCell: (params) => {
      return (
        <>
          <div className={`cellWithAdminSellerStatus ${params.row.isBlocked}`}>
            {params.row.isAdmin === true ? (
              <span className="yes">YES</span>
            ) : (
              <span className="no">NO</span>
            )}
          </div>
        </>
      );
    },
  },
  { field: "role", headerName: "Role", width: 100 },
  {
    field: "isAccountVerified",
    headerName: "Verification Status",
    width: 160,
    renderCell: (params) => {
      return (
        <>
          <div className={`cellWithStatus `}>
            {params.row.isAccountVerified === true ? (
              <span className="verified l_flex">Verified</span>
            ) : (
              <span className="unverified l_flex">Unverified</span>
            )}
          </div>
        </>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <>
          <div className={`cellWithStatus`}>
            {params.row.isBlocked ? (
              <span className="blocked l_flex">Blocked</span>
            ) : (
              <span className="active l_flex">Active</span>
            )}
          </div>
        </>
      );
    },
  },
];

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "BLOCK_REQUEST":
      return { ...state, loadingBlock: true, successBlock: false };
    case "BLOCK_SUCCESS":
      return { ...state, loadingBlock: false, successBlock: true };
    case "BLOCK_FAIL":
      return {
        ...state,
        loadingBlock: false,
        successBlock: false,
      };
    case "BLOCK_RESET":
      return {
        ...state,
        loadingBlock: false,
        successBlock: false,
      };

    case "UNBLOCK_REQUEST":
      return { ...state, loadingUnBlock: true, successUnBlock: false };
    case "UNBLOCK_SUCCESS":
      return { ...state, loadingUnBlock: false, successUnBlock: true };
    case "UNBLOCK_FAIL":
      return {
        ...state,
        loadingUnBlock: false,
        successUnBlock: false,
      };
    case "UNBLOCK_RESET":
      return {
        ...state,
        loadingUnBlock: false,
        successUnBlock: false,
      };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };
    case "DELETE_RESET":
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };

    default:
      return state;
  }
};

function UserListComponent() {
  const navigate = useNavigate();
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [
    { loading, error, users, successBlock, successUnBlock, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    users: [],
    countUsers: 0,
  });

  // Fetching Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        window.scrollTo(0, 0);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    if (successUnBlock || successBlock || successDelete) {
      dispatch({ type: "UNBLOCK_RESET" });
      dispatch({ type: "BLOCK_RESET" });
      dispatch({ type: "DELETE_RESET" });
    }
    fetchData();
  }, [successBlock, successDelete, successUnBlock, userInfo]);

  //==============
  //BLOCK HANDLER
  //==============
  const blockHandler = async (user) => {
    try {
      await axios.put(
        `${request}/api/users/block/${user.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "BLOCK_SUCCESS" });
      toast.success("user successfully blocked");
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "BLOCK_FAIL" });
    }
  };

  //==============
  //UNBLOCK HANDLER
  //==============
  const unBlockHandler = async (user) => {
    try {
      dispatch({ type: "UNBLOCK_REQUEST" });
      await axios.put(
        `${request}/api/users/unblock/${user.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UNBLOCK_SUCCESS" });
      toast.success("user successfully unblocked");
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UNBLOCK_FAIL" });
    }
  };

  //===========
  //USER DELETE
  //===========
  const deleteHandler = async (user) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await axios.delete(`${request}/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("user deleted successfully", {
          position: "bottom-center",
        });
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err), { position: "bottom-center" });
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {params.row.isBlocked === true ? (
              <div
                onClick={() => unBlockHandler(params.row)}
                className="blockButton"
              >
                UnBlock
              </div>
            ) : (
              <div
                onClick={() => blockHandler(params.row)}
                className="blockButton"
              >
                Block
              </div>
            )}
            <div
              onClick={() => deleteHandler(params.row)}
              className="deleteButton"
            >
              Delete
            </div>
            <Link to={`/user/${params.row._id}`}>
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div className="admin_page_all admin_page_screen">
      <div className="">
        <div className="productTitleContainer">
          <h3 className="productTitle light_shadow uppercase">All Users</h3>
        </div>
        <div className="datatable ">
          <span className="c_flex">
            <span></span>
            <i
              onClick={() => {
                navigate(`/user/new`);
              }}
              className="fa-solid fa-square-plus filterPlus"
            ></i>
          </span>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <DataGrid
              className="datagrid"
              rows={users}
              getRowId={(row) => row._id}
              columns={columns.concat(actionColumn)}
              autoPageSize
              rowsPerPageOptions={[10]}
              checkboxSelection
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserListComponent;
