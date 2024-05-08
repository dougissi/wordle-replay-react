import { BarChart } from '@mui/x-charts';

export function DistributionChart({ numGuesses, distributionData }) {
  console.log('num guesses:', numGuesses);
  const countLabels = Object.keys(distributionData);
  const barColors = [];
  for (let i = 1; i <= 7; i++) {
    if (numGuesses == i) {
      barColors.push("green");
    } else {
      barColors.push(null);
    }
  }

  return (
    <BarChart
      width={300}  // TODO: make customizable
      height={300}
      series={[
        { data: Object.values(distributionData), label: 'GuessDistribution', id: 'distDataId', layout: 'horizontal' },
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
    />
  );
}
