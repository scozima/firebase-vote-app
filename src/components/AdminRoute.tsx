import React from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box, Alert } from '@mui/material';
import { useUserRole } from '../hooks/useUserRole';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAdmin, loading } = useUserRole();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          このページにアクセスする権限がありません。管理者権限が必要です。
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
}; 