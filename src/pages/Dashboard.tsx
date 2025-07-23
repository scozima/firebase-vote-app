import { Typography, Box, CircularProgress, Alert } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useVoteResults } from "../hooks/useVoteResults";

const Dashboard = () => {
  const { voteResults, loading, error } = useVoteResults();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100svh - 200px)" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mb: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
          投票結果
        </Typography>
        <Typography variant="body1">現在の投票結果です。</Typography>
      </Box>

      <Box sx={{ height: "calc(100svh - 200px)", minHeight: "400px" }}>
        <BarChart
          dataset={voteResults}
          xAxis={[
            {
              scaleType: "linear",
              dataKey: "votes",
              tickMinStep: 1,
            },
          ]}
          yAxis={[
            {
              scaleType: "band",
              dataKey: "country",
              width: 60,
            },
          ]}
          series={[{ dataKey: 'votes' }]}
          layout="horizontal"
        />
      </Box>
    </>
  );
};

export default Dashboard;
