import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface DonutChartData {
  name: string;
  value: number;
  color: string;
}

const DonutChartComponent = ({ data }: { data: DonutChartData[] }) => {
  const COLORS = data.map((item) => item.color);

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};


export default DonutChartComponent;