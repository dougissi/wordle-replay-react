import { BarChart } from '@mui/x-charts';

export default function DistributionChart({ numGuesses, distributionData, green, gray }) {
  const countLabels = Object.keys(distributionData);
  const barColors = Array(7).fill(gray);
  if (numGuesses) {
    barColors[numGuesses] = green;
  }

  return (
    <BarChart
      width={300}  // TODO: make customizable
      height={300}
      series={[
        {
          data: Object.values(distributionData),
          label: 'Guess Distribution',
          id: 'distDataId',
          color: gray,
          layout: 'horizontal',
          valueFormatter: (value) => `${value} ${value === 1 ? "game" : "games"}`
        },
      ]}
      yAxis={[{
        data: countLabels,
        scaleType: 'band',
        colorMap: {
          type: 'ordinal',
          values: countLabels,
          colors: barColors
        }
      }]}
      bottomAxis={null}
      barLabel="value"
    />
  );
}
