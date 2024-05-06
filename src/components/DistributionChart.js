import { ChartContainer, BarPlot, ChartsAxis, BarChart } from '@mui/x-charts';

export function DistributionChart({ distributionData }) {
  return (
    <BarChart
      width={300}  // TODO: make customizable
      height={300}
      series={[
        { data: Object.values(distributionData), label: 'GuessDistribution', id: 'distDataId', layout: 'horizontal' },
      ]}
      yAxis={[{ data: Object.keys(distributionData), scaleType: 'band' }]}
      bottomAxis={null}
    />
  );
}
