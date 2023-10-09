import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Header from "../../components/Header";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

export default function About() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCkF5-bPHh1DsHkY2Ho8sLzpyXrO7j6-is",
  });

  const center = useMemo(
    () => ({ lat: 14.395677489753782, lng: 120.977583808926 }),
    []
  );

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="About the clinic"
          subtitle="Veterinary Clinic can be found here"
        />
      </Box>

      {/* This is for the title and image */}
      <Box display="flex" justifyContent="center" alignItems="center">
        <div>
          <Typography
            textAlign="center"
            fontSize="50px"
            alignContent="center"
            variant="h1"
            fontWeight="bold"
          >
            Veterinary Management System
          </Typography>
          <Box
            display="flow"
            justifyContent="space-between"
            alignItems="center"
          >
            <img
              src="https://livingonthecheap.com/lotc-cms/wp-content/uploads/2015/09/veterinarian-checkup-exam-dog-Depositphotos_169431684_s-2019.jpg"
              alt="clinic1"
              style={{
                height: "250px",
                width: "auto",
                margin: "20px",
              }}
            />
            <img
              src="https://bdaarc.com/images/uploads/galleryphotos/a12-Vet-Clinic-Treatment-Room.jpg"
              alt="clinic1"
              style={{
                height: "250px",
                width: "auto",
                margin: "20px",
              }}
            />
          </Box>
        </div>
      </Box>
      {/* This is for the mission and Vision content */}
      <Box display="flex" justifyContent="space-evenly" alignContent="center">
        <div style={{ padding: "20px" }}>
          <span>
            <Typography variant="h2" color={colors.eggshell[100]}>
              Mission
            </Typography>
            <Typography
              variant="h5"
              color={colors.eggshell[100]}
              marginTop="10px"
              alignContent="center"
              sx={{ width: "400px" }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. At
              quis risus sed vulputate. Sem viverra aliquet eget sit amet tellus
              cras. Magna sit amet purus gravida. Ac orci phasellus egestas
              tellus rutrum tellus pellentesque eu tincidunt.
            </Typography>
          </span>
        </div>
        <div style={{ padding: "20px" }}>
          <span>
            <Typography
              variant="h2"
              color={colors.eggshell[100]}
              alignItems="center"
            >
              Vision
            </Typography>
            <Typography
              variant="h5"
              color={colors.eggshell[100]}
              marginTop="10px"
              alignContent="center"
              sx={{ width: "400px" }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. At
              quis risus sed vulputate. Sem viverra aliquet eget sit amet tellus
              cras. Magna sit amet purus gravida. Ac orci phasellus egestas
              tellus rutrum tellus pellentesque eu tincidunt.
            </Typography>
          </span>
        </div>
      </Box>
      {/* This is for the map */}

      <Box m="20px" justifyContent="center" alignItems="center" display="flex">
        <Typography
          variant="h1"
          color={colors.quincy[300]}
          fontWeight="100px"
          marginRight="20px"
        >
          Come visit us at:
        </Typography>
        <Typography
          variant="h5"
          color={colors.eggshell[100]}
          marginTop="10px"
          alignContent="center"
          sx={{ width: "400px" }}
        >
          Molino Road, Molino I, Bacoor City, 4102 Cavite, Philippines
        </Typography>
      </Box>
      <Box m="30px" display="flex">
        <GoogleMap
          zoom={15}
          center={center}
          mapContainerClassName="map-container"
        >
          <MarkerF position={center} />
        </GoogleMap>
      </Box>
    </Box>
  );
}

//THIS PROJECT WAS MADE BY PROMETHEUS
