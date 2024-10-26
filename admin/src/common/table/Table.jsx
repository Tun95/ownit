import { useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import MessageBox from "../../utilities/message loading/MessageBox";
import { getError, useAppContext } from "../../utilities/utils/Utils";
import { request } from "../../base url/BaseUrl";

const Button = ({ type }) => (
  <button className={`widgetLgButton ${type}`}>{type}</button>
);

Button.propTypes = {
  type: PropTypes.oneOf(["Verified", "Unverified"]).isRequired,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const TableData = () => {
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [{ users, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`${request}/api/users`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: { users: data } });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [userInfo]);

  console.log("USER:", users);

  return (
    <>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">ID</TableCell>
              <TableCell className="tableCell">Email</TableCell>
              <TableCell className="tableCell">Date</TableCell>
              <TableCell className="tableCell">Role</TableCell>
              <TableCell className="tableCell">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="tableCenter p_flex">
            {users?.users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="tableCell">{user._id}</TableCell>
                <TableCell className="tableCell">{user.email}</TableCell>
                <TableCell className="tableCell">
                  {new Date(user.createdAt)?.toISOString()?.substring(0, 10)}
                </TableCell>
                <TableCell className="tableCell">{user.role}</TableCell>
                <TableCell className="tableCell">
                  {user.isAccountVerified ? (
                    <Button type="Verified" />
                  ) : (
                    <Button type="Unverified" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : users?.length === 0 ? (
        <span className="product-not">
          <MessageBox>No Users Found</MessageBox>
        </span>
      ) : null}
    </>
  );
};

export default TableData;
