import PropTypes from "prop-types";
import "./featured.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function Featured({ localGovernmentStats }) {
  return (
    <div className="featured light_shadow">
      <div className="featured_table">
        <div className="table_content">
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 500, overflow: "auto" }}
            className="table"
          >
            <Table sx={{ minWidth: 400 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="tableCell">Local Governments</TableCell>
                  <TableCell className="tableCell">Registered Users</TableCell>
                  <TableCell className="tableCell">Checked Ins</TableCell>
                  <TableCell className="tableCell">Checked Outs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tableCenter p_flex">
                {localGovernmentStats.map((stat) => (
                  <TableRow key={stat.localGovernment}>
                    <TableCell className="tableCell">
                      {stat.localGovernment} ({stat.limit})
                    </TableCell>
                    <TableCell className="tableCell">{stat.count}</TableCell>
                    <TableCell className="tableCell">
                      {stat.eventCheckIns}
                    </TableCell>
                    <TableCell className="tableCell">
                      {stat.checkouts}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

Featured.propTypes = {
  localGovernmentStats: PropTypes.arrayOf(
    PropTypes.shape({
      localGovernment: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      limit: PropTypes.number.isRequired,
      eventCheckIns: PropTypes.number.isRequired,
      checkouts: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Featured;
