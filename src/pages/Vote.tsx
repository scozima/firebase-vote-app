import { useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { countries } from "../data/countries";
import { useVote } from "../hooks/useVote";
import { VoteCard } from "../components/vote/VoteCard";
import { VoteDialog } from "../components/vote/VoteDialog";
import { VoteSnackbar } from "../components/vote/VoteSnackbar";
import type { SelectedCountry } from "../types/vote";
import Voted from "../components/Voted";

const Vote = () => {
  const {
    user,
    loading,
    hasVoted,
    votedCountry,
    snackbar,
    submitVote,
    closeSnackbar,
  } = useVote();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCountry, setSelectedCountry] =
    useState<SelectedCountry | null>(null);

  const handleVote = (countryKey: string) => {
    if (!user) {
      return;
    }

    if (hasVoted) {
      return;
    }

    const country = countries.find((c) => c.key === countryKey);
    if (country) {
      setSelectedCountry({
        nameJa: country.nameJa,
        nameEn: country.nameEn,
        key: country.key,
      });
      setOpenDialog(true);
    }
  };

  const handleConfirmVote = async () => {
    if (!selectedCountry) return;

    const success = await submitVote(selectedCountry);
    if (success) {
      setOpenDialog(false);
      setSelectedCountry(null);
    }
  };

  const handleCancelVote = () => {
    setOpenDialog(false);
    setSelectedCountry(null);
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
          次に行きたい海外旅行先はどこ？
        </Typography>
        <Typography variant="body1">
          あなたが行ってみたい海外旅行先に投票してください
          <br />
          画像をクリックすると投票できます。（1アカウントにつき1回のみ）
        </Typography>
      </Box>

      {hasVoted && (
        <Box sx={{ mb: 3 }}>
          <Voted votedCountry={votedCountry} />
        </Box>
      )}

      <Grid container spacing={2}>
        {countries.map((country) => (
          <VoteCard
            key={country.key}
            country={country}
            onVote={handleVote}
            disabled={!user || hasVoted}
          />
        ))}
      </Grid>

      <VoteDialog
        open={openDialog}
        selectedCountry={selectedCountry}
        loading={loading}
        onConfirm={handleConfirmVote}
        onCancel={handleCancelVote}
      />

      <VoteSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </>
  );
};

export default Vote;
