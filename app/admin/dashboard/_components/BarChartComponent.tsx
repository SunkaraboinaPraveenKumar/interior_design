import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";

interface BarChartData {
  name: string;
  value: number;
  color: string;
}

const BarChartComponent = ({ data }: { data: BarChartData[] }) => {
  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#8884d8">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  );
};

export default BarChartComponent;