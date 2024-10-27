import PropTypes from "prop-types";
import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ aspect, title, data, dataKeys, CustomTooltip, grid }) => {
  return (
    <div className="chart__box light_shadow">
      <div className="title">{title}</div>
      <ResponsiveContainer aspect={aspect}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 5, left: 5, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="gray" /> {/* Update this line */}
          {grid && (
            <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          )}
          {CustomTooltip && <Tooltip content={<CustomTooltip />} />}
          {dataKeys.map((key) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#total)"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

Chart.propTypes = {
  aspect: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      "Bills Votes": PropTypes.number,
      "Election Votes": PropTypes.number,
    })
  ).isRequired,
  dataKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  CustomTooltip: PropTypes.func,
  grid: PropTypes.bool,
};

export default Chart;
