import { useState, React } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { AppRegistration } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import FeedIcon from "@mui/icons-material/Feed";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import SummarizeIcon from "@mui/icons-material/Summarize";
import AddIcon from '@mui/icons-material/Add';
import FeedbackIcon from '@mui/icons-material/Feedback';

const Item = ({ title, to, icon, selected, setSelected, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const out_and_select = (pamagat) => {
    if (user?.uid) {
      signOut(auth).then(() => {
        toast.info("You have successfully logged out");
      });
    }
    setSelected(pamagat);
  };
  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.eggshell[200] }}
      onClick={() => out_and_select(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.moss[700]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-inner-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed} style={{ height: "100%" }}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.eggshell[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {/* USER */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="Dental Logo"
                  width="150px"
                  height="150px"
                  src="https://firebasestorage.googleapis.com/v0/b/vet-clinic-app-8203d.appspot.com/o/AniCare-Logo---1.png?alt=media&token=98d1dbd0-6732-4756-88ce-9d377973293d"
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                {"kcTXHOFgipUdEXJCTqQQ53ammrG3" === user?.uid && (
                  <Typography
                    variant="h2"
                    color={colors.eggshell[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    Administrator
                  </Typography>
                )}
                <Typography variant="h5" color={colors.bud[200]}>
                  Veterinary Management
                </Typography>
              </Box>
            </Box>
          )}

          {/* Menu Items */}
          <Box paddingLeft={!isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlined />}
              selected={selected}
              setSelected={setSelected}
            />
            {"kcTXHOFgipUdEXJCTqQQ53ammrG3" === user?.uid && (
              <Item
                title="Patient Manifest"
                to="/patients"
                icon={<AssignmentIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {"kcTXHOFgipUdEXJCTqQQ53ammrG3" === user?.uid && (
              <Item
                title="Create Walk-in"
                to="/walk-in"
                icon={<AppRegistration />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {"kcTXHOFgipUdEXJCTqQQ53ammrG3" === user?.uid && (
              <Item
                title="Attendance Lister"
                to="/lister"
                icon={<SummarizeIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {"kcTXHOFgipUdEXJCTqQQ53ammrG3" === user?.uid && (
              <Item
                title="View Patient Details"
                to="/details"
                icon={<FeedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {"kcTXHOFgipUdEXJCTqQQ53ammrG3" === user?.uid && (
              <Item 
                title = "Add a service"
                to = "/addservice"
                icon={<AddIcon/>}
                selected={selected}
                setSelected={setSelected}
              />
            )}
              {"kcTXHOFgipUdEXJCTqQQ53ammrG3" === user?.uid && (
              <Item
                title="Feedbacks"
                to="/feedbacks"
                icon={<FeedbackIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {user?.uid ? (
              <Item
                title="Press me to logout"
                to="/"
                icon={<PersonOutlined />}
                selected={selected}
                setSelected={setSelected}
                user={user}
              />
            ) : (
              <Item
                title="Login to the system"
                to="/"
                icon={<PersonOutlined />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            <Item
              title="About the clinic"
              to="/about"
              icon={<InfoIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;

//THIS PROJECT WAS MADE BY PROMETHEUS
