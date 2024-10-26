import { useEffect, useReducer } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import photo from "../../../assets/others/photo.jpg";
import ReactTimeAgo from "react-time-ago";

import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";
import { request } from "../../../base url/BaseUrl";
import { getError, useAppContext } from "../../../utilities/utils/Utils";

const initialState = {
  loading: true,
  error: "",
  events: [],
  loadingDelete: false,
  successDelete: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, events: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

function ReportsListComponent() {
  const columns = [
    { field: "_id", headerName: "ID", width: 320 },
    {
      field: "title",
      headerName: "Title",
      width: 350,
      renderCell: (params) => (
        <div className="cellWidthImg">
          <img
            src={params.row.image || photo}
            alt="event_banner"
            className="cellImg"
          />
          {params.row.title}
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 180,
      renderCell: (params) => (
        <div className="cellWidthImg">
          <ReactTimeAgo
            date={Date.parse(params.row.createdAt)}
            locale="en-US"
          />
        </div>
      ),
    },
  ];

  const navigate = useNavigate();

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [{ loading, error, events, successDelete }, dispatch] = useReducer(
    reducer,
    initialState
  );

  //===================
  // FETCH HANDLER
  //===================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${request}/api/events`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        window.scrollTo(0, 0);
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  //===================
  // DELETE HANDLER
  //===================
  const deleteHandler = async (event) => {
    if (window.confirm("Are you sure to delete this event?")) {
      try {
        await axios.delete(`${request}/api/events/${event._id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        toast.success("Event deleted successfully", {
          position: "bottom-center",
        });
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: "DELETE_FAIL",
          payload: getError(err),
        });
      }
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 220,
      renderCell: (params) => (
        <div className="cellAction">
          <Link
            to={`/events/${params.row._id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton">View</div>
          </Link>
          <div
            className="deleteButton"
            onClick={() => deleteHandler(params.row)}
          >
            Delete
          </div>
        </div>
      ),
    },
  ];

  const customTranslations = {
    noRowsLabel: "No events found",
  };

  return (
    <div className="admin_page_all admin_page_screen">
      <div className="">
        <div className="productTitleContainer">
          <h3 className="productTitle light_shadow uppercase">All Event</h3>
        </div>
        <div className="datatable">
          <span className="c_flex">
            <span></span>
            <i
              onClick={() => {
                navigate(`/event/new`);
              }}
              className="fa-solid fa-square-plus filterPlus"
            ></i>
          </span>
          {loading || successDelete ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <DataGrid
              className="datagrid"
              rows={events}
              localeText={customTranslations}
              getRowId={(row) => row._id}
              columns={columns.concat(actionColumn)}
              autoPageSize
              checkboxSelection
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportsListComponent;
