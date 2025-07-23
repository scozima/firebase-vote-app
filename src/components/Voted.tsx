import { Alert, Box } from "@mui/material";
import { countries } from "../data/countries";


interface VotedProps {
  votedCountry: string | null;
}

const Voted = ({ votedCountry }: VotedProps) => {

  const country = countries.find((country) => country.key === votedCountry);



  return (
    <Box sx={{md: 3}}>
      <Alert severity="success" sx={{mt: 2}}>
        投票ありがとうございました。<b>{country?.nameJa}</b>に投票しました！
      </Alert>
    </Box>
  )
}

export default Voted