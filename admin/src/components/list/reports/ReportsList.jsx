import { useEffect, useReducer, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/styles.scss";
import axios from "axios";
import { toast } from "react-toastify";
import { getError, useAppContext } from "../../../utilities/utils/Utils";
import { request } from "../../../base url/BaseUrl";
import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";
import ReactTimeAgo from "react-time-ago";

import SearchIcon from "@mui/icons-material/Search";
// Format numbers with commas (e.g., 2,300,454)
const formatNumberWithCommas = (num) => {
  const validNumber = isNaN(num) || num === null || num === undefined ? 0 : num;
  return validNumber.toLocaleString();
};

const privacyPreferenceListOptions = ["public", "anonymous"];

const issueTypeOptions = [
  "Infrastructure",
  "Learning Materials",
  "Pupil or Student Related",
  "Teacher Related",
];

const statusListOptions = ["pending", "approved", "disapproved"];

const statusUpdateOptions = ["approved", "disapproved"];

const columns = [
  { field: "schoolName", headerName: "School Name", width: 220 },
  { field: "schoolLocation", headerName: "School Location", width: 220 },
  { field: "issueType", headerName: "Issue Type", width: 230 },
  {
    field: "user",
    headerName: "Submitted By",
    width: 220,
    renderCell: (params) => {
      return (
        <>
          <div className="cellWidthImg">
            {params.row?.user?.lastName} {params.row?.user?.firstName}
          </div>
        </>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Date",
    width: 180,
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
    field: "status",
    headerName: "Approval Status",
    width: 160,
    renderCell: (params) => (
      <div className={`cellWithStatus ${params.row.status}`}>
        {params.row.status === "pending" ? (
          <span className="l_flex pending">Pending</span>
        ) : params.row.status === "approved" ? (
          <span className="l_flex approved">Approved</span>
        ) : (
          <span className="l_flex disapproved">Disapproved</span>
        )}
      </div>
    ),
  },
];

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        reports: action.payload.reports,
        countReports: action.payload.countReports,
        error: "",
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    case "STATUS_UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "STATUS_UPDATE_SUCCESS":
      return {
        ...state,
        loadingUpdate: false,
        successUpdate: true,
        reports: state.reports.map((report) =>
          report._id === action.payload._id
            ? { ...report, status: action.payload.status }
            : report
        ),
      };
    case "STATUS_UPDATE_FAIL":
      return { ...state, loadingUpdate: false, error: action.payload };
    case "STATUS_UPDATE_RESET":
      return { ...state, successUpdate: false };
    default:
      return state;
  }
};

const ReportsListComponent = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const searchQuery = sp.get("searchQuery") || "all";
  const status = sp.get("status") || "all";
  const issueType = sp.get("issueType") || "all";
  const privacyPreference = sp.get("privacyPreference") || "all";
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const limit = 10;

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [
    {
      loading,
      error,
      reports,
      countReports,
      successDelete,
      loadingUpdate,
      successUpdate,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    reports: [],
    countReports: 0,
    loadingUpdate: false,
    successUpdate: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${request}/api/reports/filters?searchQuery=${searchQuery}&status=${status}&issueType=${issueType}&privacyPreference=${privacyPreference}&page=${page}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${userInfo?.token}` },
          }
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: { reports: data.reports, countReports: data.countReports },
        });
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
    }
    if (successUpdate) {
      dispatch({ type: "STATUS_UPDATE_RESET" });
    }
    fetchData();
  }, [
    status,
    issueType,
    privacyPreference,
    searchQuery,
    successDelete,
    successUpdate,
    userInfo,
    page,
  ]);

  const getFilterUrl = (filter) => {
    const filterSearchQuery = encodeURIComponent(filter.searchQuery || "all");
    const filterStatus = encodeURIComponent(filter.status || "all");
    const filterIssueType = encodeURIComponent(filter.issueType || "all");
    const filterPrivacyPreference = encodeURIComponent(
      filter.privacyPreference || "all"
    );

    return `/reports?searchQuery=${filterSearchQuery}&status=${filterStatus}&issueType=${filterIssueType}&privacyPreference=${filterPrivacyPreference}`;
  };

  // DELETE HANDLER
  const deleteHandler = async (report) => {
    if (window.confirm("Are you sure to delete this report?")) {
      try {
        await axios.delete(`${request}/api/reports/${report._id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        toast.success("Report deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  const handleFilterChange = (e) => {
    let name;
    let value;

    if (e.target instanceof HTMLSelectElement) {
      name = e.target.name;
      value = e.target.value;

      const newFilters = {
        searchQuery: "all",
        status,
        issueType,
        privacyPreference,
        [name]: value,
      };

      navigate(getFilterUrl(newFilters));
    } else if (e.target instanceof HTMLInputElement) {
      name = "searchQuery";
      value = e.target.value;

      const newFilters = {
        searchQuery: value === "" ? "all" : value,
        status,
        issueType,
        privacyPreference,
      };

      navigate(getFilterUrl(newFilters));
    } else {
      return;
    }
  };

  const handleClearAll = () => {
    const newFilters = {
      searchQuery: "all",
      status: "all",
      issueType: "all",
      privacyPreference: "all",
    };

    navigate(getFilterUrl(newFilters));
  };

  // UPDATE STATUS HANDLER
  const handleStatusUpdate = async () => {
    console.log("Selected Report IDs:", selectedReportId);
    console.log("Selected Status:", selectedStatus);

    // Ensure selectedReportId is an array
    const reportIds = Array.isArray(selectedReportId)
      ? selectedReportId
      : [selectedReportId];

    if (!reportIds.length || !selectedStatus) {
      toast.error("Please select a report and status to update.");
      return;
    }

    try {
      dispatch({ type: "STATUS_UPDATE_REQUEST" });
      const { data } = await axios.put(
        `${request}/api/reports/update-status`,
        {
          reportIds, // Now this will be the full array
          action: selectedStatus === "approved" ? "approve" : "disapprove",
        },
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );

      toast.success("Status updated successfully");
      dispatch({ type: "STATUS_UPDATE_SUCCESS", payload: data });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "STATUS_UPDATE_FAIL", payload: getError(err) });
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div className="cellAction">
          <div
            onClick={() => deleteHandler(params.row)}
            className="deleteButton"
          >
            Delete
          </div>
          <Link to={`/reports/${params.row._id}`}>
            <div className="viewButton">View</div>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="admin_page_all admin_page_screen">
      <div className="">
        <div className="productTitleContainer">
          <h3 className="productTitle light_shadow uppercase">All Reports</h3>
        </div>
        <div className="datatable">
          <div className="filter_box mb">
            <div className="filters">
              <span className="count_reports">
                Reports Found: {formatNumberWithCommas(countReports)}
              </span>
              <div className="form_box mb">
                <input
                  type="search"
                  placeholder="Search by school name"
                  value={searchQuery === "all" ? "" : searchQuery}
                  onChange={handleFilterChange}
                />
                <SearchIcon className="icon" />
              </div>
              <div className="select_boxes">
                <div className="form_box">
                  <label htmlFor="privacyPreference">Privacy Preference:</label>
                  <select
                    name="privacyPreference"
                    className="select"
                    value={privacyPreference}
                    onChange={handleFilterChange}
                  >
                    <option value="">Sort by Privacy Preference</option>
                    {privacyPreferenceListOptions.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form_box">
                  <label htmlFor="issueType">Issue Type:</label>
                  <select
                    name="issueType"
                    className="select"
                    value={issueType}
                    onChange={handleFilterChange}
                  >
                    <option value="">Sort by Issue Type</option>
                    {issueTypeOptions.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form_box">
                  <label htmlFor="status">Approval Status:</label>
                  <select
                    name="status"
                    className="select"
                    value={status}
                    onChange={handleFilterChange}
                  >
                    <option value="">Sort by Approval Status</option>
                    {statusListOptions.map((item, index) => (
                      <option value={item} key={index}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="clear_btn l_flex">
                  <button className="main_btn" onClick={handleClearAll}>
                    Clear All
                  </button>
                </div>
                <div></div>

                {/* STATUS UPDATE SECTION */}
                <div className="form_box">
                  <div className="select_btn a_flex">
                    <div className="select_span">
                      <label htmlFor="updatestatus">Update Status:</label>
                      <select
                        name="updatestatus"
                        className="select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        {statusUpdateOptions.map((item, index) => (
                          <option value={item} key={index}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="update_btn">
                      <button className="main_btn" onClick={handleStatusUpdate}>
                        {loadingUpdate ? (
                          <span className="a_flex">
                            <i className="fa fa-spinner fa-spin"></i>
                            Updating...
                          </span>
                        ) : (
                          "Update Status"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="reports_data_table mb">
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <DataGrid
                className="datagrid"
                getRowId={(row) => row._id}
                rows={reports}
                columns={columns.concat(actionColumn)}
                pageSize={10}
                autoPageSize
                rowCount={countReports}
                rowsPerPageOptions={[10]}
                paginationMode="server"
                page={page - 1}
                onPageChange={(newPage) => setPage(newPage + 1)}
                checkboxSelection
                onRowSelectionModelChange={(ids) => {
                  console.log("Row Selection IDs:", ids);
                  setSelectedReportId(ids.length ? ids : null); // Set to all selected IDs
                }}
                disableSelectionOnClick
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsListComponent;
