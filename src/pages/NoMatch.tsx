import { Button, Container, Stack, Typography } from "@mui/material";

function NoMatch() {
  return (
    <>
      <Container>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <Typography sx={{ textAlign: "center" }}>
            申し訳ありませんが、現在このページは存在しません。
            <br />
            以下ページにアクセスして目的のページを再度お探しくださいませ。
          </Typography>
          <Button href="/" variant="contained">
            ホームへ
          </Button>
        </Stack>
      </Container>
    </>
  );
}

export default NoMatch;
