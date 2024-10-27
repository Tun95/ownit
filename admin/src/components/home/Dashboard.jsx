import { useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

import "./styles.scss";
import axios from "axios";
import Widget from "../../common/widget/Widget";
import Chart from "../../common/chart/Chart";
import { getError, useAppContext } from "../../utilities/utils/Utils";
import { request } from "../../base url/BaseUrl";
import TableData from "../../common/table/Table";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Dashboard() {
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [{ summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: {
      totalUsers: 0,
      totalReports: 0,
      reportStatusCounts: {
        approved: 0,
        pending: 0,
        disapproved: 0,
      },
      last10DaysData: [],
    },
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/generals/summary`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const [dataStats, setDataStats] = useState([]);

  useEffect(() => {
    const getStats = () => {
      const stats = summary.last10DaysData.map((item) => ({
        date: item.date,
        "Registered Users": item.totalUsers,
        "Submitted Reports": item.totalReports,
      }));
      setDataStats(stats);
    };
    getStats();
  }, [summary.last10DaysData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom_tooltip" style={{ padding: "10px" }}>
          <p className="label">{`Date: ${label}`}</p>
          <p className="" style={{ color: "#5550bd", marginTop: "3px" }}>
            Registered Users: {payload[0]?.payload["Registered Users"] ?? 0}
          </p>
          <p className="" style={{ color: "#5550bd", marginTop: "3px" }}>
            Submitted Reports: {payload[0]?.payload["Submitted Reports"] ?? 0}
          </p>
        </div>
      );
    }
    return null;
  };

  // Prop types for CustomTooltip
  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        payload: PropTypes.shape({
          "Registered Users": PropTypes.number,
          "Submitted Reports": PropTypes.number,
        }),
      })
    ),
    label: PropTypes.string,
  };

  const TotalUsers = summary.totalUsers;
  const TotalReports = summary.totalReports;
  const TotalApproved = summary.reportStatusCounts.approved;
  const TotalPending = summary.reportStatusCounts.pending;
  const TotalDisapproved = summary.reportStatusCounts.disapproved;

  return (
    <div className="admin_page_all admin_page_screen">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <div className="home dashboard s_flex">
        <>
          <div className="widgets">
            <Widget TotalUsers={TotalUsers} type="user" />
            <Widget TotalReports={TotalReports} type="reports" />
            <Widget TotalApproved={TotalApproved} type="approved" />
            <Widget TotalPending={TotalPending} type="pending" />
            <Widget TotalDisapproved={TotalDisapproved} type="disapproved" />
          </div>

          <div className="charts">
            <Chart
              title="Last 10 Days User Registrations and Submitted Reports"
              data={dataStats}
              grid
              dataKeys={["Registered Users", "Submitted Reports"]}
              aspect={2 / 1}
              CustomTooltip={CustomTooltip}
            />
          </div>

          <div className="listContainer">
            <div className="listTitle">Latest Registered Users</div>
            <TableData />
          </div>
        </>
      </div>
    </div>
  );
}

// Prop types for the Dashboard component
Dashboard.propTypes = {
  userInfo: PropTypes.shape({
    token: PropTypes.string,
  }),
};

export default Dashboard;
