import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import type { User } from "firebase/auth";

interface UserInfoProps {
  user: User | null;
}

export const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: "none", sm: "flex" },
        alignItems: "center",
        gap: 1,
      }}
    >
      {user.photoURL && (
        <Avatar
          alt={user.displayName || ""}
          src={user.photoURL || ""}
          sx={{ width: 35, height: 35 }}
        />
      )}
      <Typography variant="body2">{user.email}</Typography>
    </Box>
  );
};
