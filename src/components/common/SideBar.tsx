import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
} from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import LineAxisIcon from "@mui/icons-material/LineAxis";
import { Logout as LogoutIcon } from "@mui/icons-material";

import React, { type CSSProperties } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useUserRole } from "../../hooks/useUserRole";

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerTransitionEnd: () => void;
  handleDrawerClose: () => void;
}

interface menuItem {
  text: string;
  path: string;
  icon: React.ComponentType;
}

const SideBar = ({
  mobileOpen,
  drawerWidth,
  handleDrawerTransitionEnd,
  handleDrawerClose,
}: SidebarProps) => {
  const { isAdmin } = useUserRole();
  
  const MenuItems: menuItem[] = [
    {
      text: "Vote",
      path: "/",
      icon: HowToVoteIcon,
    },
    ...(isAdmin ? [{
      text: "Dashboard",
      path: "/dashboard",
      icon: LineAxisIcon,
    }] : []),
  ];

  const baseLinkStyle: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  };

  const activeLinkStyle: CSSProperties = {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />

      <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "calc(100svh - 65px)" }}>
        <List>
          {MenuItems.map((item, index) => (
            <NavLink
              key={item.text}
              to={item.path}
              style={({ isActive }) => ({
                ...baseLinkStyle,
                ...(isActive ? activeLinkStyle : {}),
              })}
            >
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            </NavLink>
          ))}
        </List>
        <Box sx={{ padding: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            ログアウト
          </Button>
        </Box>
      </Box>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* モバイル用 */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        slotProps={{
          root: {
            keepMounted: true, // Better open performance on mobile.
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* PC用 */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default SideBar;
