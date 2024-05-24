import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie({ data }) {
  return (
    <PieChart
      series={[
        {
          data: data,
        },
      ]}
      width={400}
      height={200}
    />
  );
}
