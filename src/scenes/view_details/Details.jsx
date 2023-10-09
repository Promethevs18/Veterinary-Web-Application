import React, { useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Avatar, Box, Button, TextField, Typography, colors, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { get, getDatabase, onValue, ref, remove, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser"
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";

const initialValues = {
  ownerName: "",
  petName: "",
  petAddress: "",
  ownerContact: "",
  ownerEmail: "",
  petBirth: "",
  petAge: "",
  sched_date: "",
};

const detailSchema = yup.object().shape({
  ownerName: yup.string().required("This field is required"),
});

const Details = ({ user }) => {

  const db = getDatabase();
  const [image, setImage] = useState(
    "https://firebasestorage.googleapis.com/v0/b/dental-management-system-2dccb.appspot.com/o/Profile-pic.png?alt=media&token=5e0d4817-042b-4cf3-b31d-fb3a1d675ec1"
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const formikRef = useRef(null);
  const navigate = useNavigate();
  const [beforeDate, setBefore] = useState("");
  const [rows, setRows] = useState([]);
  const [bookTime, setBookTime] = useState("");

  //ETO YUNG KUNG MAGSEARCH NG PATIENT
  const search = async (name_search, pet_search) => {

    setBefore("")
    let prevHolder = [];
    const patient = ref(
      db,
      "Owners and Pets/" +
        name_search +
        "/" + pet_search
    );
    const booking = ref(
      db,
      "Owners/" + name_search + "/Booking"
    );

    const previous = ref(
      db, "Owners/" + name_search + "/Previous Bookings" 
    );

    const take = await get(patient);
    const takeBooking = await get(booking)
  

    // for getting the previous bookings
      onValue(previous, (snappy) =>{
        snappy.forEach((prevSnap) =>{
          prevHolder.push({
            id: prevSnap.key,
            ...prevSnap.val()
          })
        })
        setRows(prevHolder)
      })

    if (take.exists()) {
      const patientData = take.val();
      const bookingData = takeBooking.val();
      
      const updatedIni = {
        petAddress: patientData.petAddress || "",
        changed: patientData.changed || "",
        ownerContact: patientData.ownerContact || "",
        ownerEmail: patientData.ownerEmail || "",
        ownerName: patientData.ownerName || "",
        petBirth: patientData.petBirth || "",
        petAge: patientData.petAge || "",
        petImage: patientData.petImage || "",
        sched_date: bookingData ? bookingData.sched_date || "No upcoming appointment" : "No upcoming appointment",
      };

      //for updating the fields with data taken from the database
      formikRef.current.setFieldValue("petAddress", updatedIni.petAddress);
      formikRef.current.setFieldValue("changed", updatedIni.changed);
      formikRef.current.setFieldValue("ownerContact", updatedIni.ownerContact);
      formikRef.current.setFieldValue("ownerEmail", updatedIni.ownerEmail);
      formikRef.current.setFieldValue("ownerName", updatedIni.ownerName);
      formikRef.current.setFieldValue("petBirth", updatedIni.petBirth);
      formikRef.current.setFieldValue("petAge", updatedIni.petAge);
      formikRef.current.setFieldValue("sched_date", updatedIni.sched_date);
      
      if(bookingData !== null){
        //this is for taking the previous date na gagamitin for rebooking
        setBefore(bookingData.sched_date);
      }
      setBookTime(bookingData.sched_time)
  
      setImage(take.val().petImage);
    } else {
      toast.error("Cannot find patient");
    }
  };

  //ETO NAMAN YUNG PARA SA PAG UPLOAD NG DATA IF MAY CHANGES
  const updateData = async (details) => {
    if (
      window.confirm(
        "Are you sure you want to reschedule the patient's booking?"
      )
    ) {
      if (details.sched_date !== null) {
        try {
          //this code is to remove the old booking
          remove(ref(db, "Bookings/" + beforeDate + "/" + details.ownerName));
          //this code is for updating the date ng patient
          update(ref(db, "Owners/"+ details.ownerName + "/Booking" ), {sched_date : details.sched_date})
          //eto ay i update ang booking para sa dashboard reference
          await update(
            ref(
              db,
              "Bookings/" +
                details.sched_date +
                "/" +
                details.ownerName
            ),
            {
              sched_time: bookTime,
              ...details,
              changed: "Yes",
            },
          )
            //ETO NAMAN FOR THE EMAILING SHIT
          //this property creates a temporary form na kukuha ng values from the formik
          //para hawakan nya sa email natin
          const templateParams = {
            ...formikRef.current.values,
          };

          //eto naman ang method para magsend ng email to the user
          //kasama rito ang serviceID, templateID, at yung PublicID, pati narin yung templateParams
          emailjs
            .send(
              "service_8a7jy2s",
              "template_gcoxliu",
              templateParams,
              "p4xfnVj9crR2omWTm"
            )
            .then(() => {
              toast.success(
                "Email has been sent sucessfully and record has been updated"
              );
            })
            .catch((error) => {
              toast.error("Error sending email:", error);
            });
        } catch (error) {
          toast.error(error);
        }
      }
      navigate("/dashboard");
    }
  };

  //ETO NAMAN YUNG PARA SA DELETE BUTTON
  const handleDelete = async (id, petID) => {
    if (window.confirm("Are you REALLY sure you want to delete the data")) {
      try {
        await remove(ref(db, "Owners and Pets/" + id + "/"+ petID));
        toast.success("Patient record has been deleted permanently");
      } catch (error) {
        toast.error(error);
      }
    }
    navigate("/dashboard");
  };


  // Eto naman for the rows of the datagrid
  const columns = [
    {field:"patients", headerName: "Patients", flex: 1},
    {field:"sched_date", headerName: "Scheduled Date", flex: 1},
    {field:"sched_time", headerName: "Scheduled Time", flex: 1},
    {field:"services", headerName: "Services performed", flex: 1}
  ]
  return (
    <Box m="20px">
      <Header
        title="VIEW PATIENT DETAILS"
        subtitle="This section provides the details of a specific patient. The results came from either selected from the 'Patients Manifest' or searching for it below "
      />
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={detailSchema}
        onSubmit={updateData}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => (
          <Form>
            <Box display="flex" justifyContent="center" m="20px">
              <Avatar
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  height: "20%",
                  width: "20%",
                }}
                alt="your image"
                src={image}
              />
            </Box>

            <Box display="flex" justifyContent="center" m="20px">
              <TextField
                variant="filled"
                fullWidth
                type="text"
                value={values.ownerName}
                onBlur={handleBlur}
                onChange={handleChange}
                label="Owner's Name"
                name="ownerName"
                error={!!touched.ownerName && !!errors.ownerName}
                helperText={touched.ownerName && errors.ownerName}
                sx={{ maxWidth: "50%", marginRight: "15px" }}
              />

              <TextField
                variant="filled"
                fullWidth
                type="text"
                value={values.petName}
                onBlur={handleBlur}
                onChange={handleChange}
                label="Pet Name"
                name="petName"
                error={!!touched.petName && !!errors.petName}
                helperText={touched.petName && errors.petName}
                sx={{ maxWidth: "25%" }}
              />

              <Button
                sx={{ m: "20px" }}
                variant="contained"
                color="secondary"
                startIcon={<SearchIcon />}
                onClick={() => search(values.ownerName, values.petName)}
              ></Button>
            </Box>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            >
              <TextField
                variant="filled"
                fullWidth
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email address"
                name="ownerEmail"
                value={values.ownerEmail}
                disabled={true}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                variant="filled"
                fullWidth
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Address"
                name="petAddress"
                disabled={true}
                value={values.petAddress}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ownerContact}
                name="ownerContact"
                disabled={true}
                error={!!touched.ownerContact && !!errors.ownerContact}
                helperText={touched.ownerContact && errors.ownerContact}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Birthday"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.petBirth}
                name="petBirth"
                disabled={true}
                error={!!touched.petBirth && !!errors.petBirth}
                helperText={touched.petBirth && errors.petBirth}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Pet Age"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.petAge}
                disabled={true}
                name="petAge"
                error={!!touched.petAge && !!errors.petAge}
                helperText={touched.petAge && errors.petAge}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Appointment Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.sched_date}
                name="sched_date"
                error={!!touched.sched_date && !!errors.sched_date}
                helperText={touched.sched_date && errors.sched_date}
                sx={{ gridColumn: "span 1" }}
              />
            </Box>
            {/* Buttons */}
            <Box display="flex" justifyContent="center" m="50px">
            {beforeDate !== "" && (
              <Button type="submit" color="secondary" variant="contained">
                Update Patient Booking
              </Button>
              )}
              {values.ownerEmail !== "" && (
                <span style={{ marginLeft: "20px" }}>
                  <Button
                    color="reddish"
                    variant="contained"
                    m="20px"
                    onClick={() => handleDelete(values.ownerName, values.petName)}
                  >
                    Delete Record Permanently
                  </Button>
                </span>
              )}
            </Box>
          </Form>
        )}
      </Formik>
  
       <Box m="50px" display="flex" justifyContent="center">
              <Typography 
                variant="h2"
                color={colors.eggshell[100]}
                fontWeight="bold"
                m="20px">
                  Owner's Previous appointments
                </Typography>
        </Box>
            <Box m="40px 0 0 0" height="50vh" sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                },
                "& .name-column--cell": {
                  color: colors.moss[300],
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: colors.quincy[700],
                  borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: colors.eggshell[700],
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: colors.quincy[700],
                },
              }} >
      
            <DataGrid
               rows={rows}
               columns={columns}
            />
            
            </Box>
  
     
    </Box>
  );
};

export default Details;

//THIS PROJECT WAS MADE BY PROMETHEUS
