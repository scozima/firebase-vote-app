import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import type { Country } from "../../types/vote";

interface VoteCardProps {
  country: Country;
  onVote: (countryKey: string) => void;
  disabled: boolean;
}

export const VoteCard = ({ country, onVote, disabled }: VoteCardProps) => {
  return (
    <Grid size={{ xs: 12, md: 6 }} alignItems="stretch">
      <Card sx={{ height: "100%" }}>
        <CardActionArea
          onClick={() => onVote(country.key)}
          disabled={disabled}
        >
          <CardMedia
            component="img"
            height="180"
            image={country.image}
            alt={country.nameJa}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {country.nameJa} – {country.nameEn}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {country.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}; 