import React, { useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Avatar, Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { get, getDatabase, onValue, ref, remove, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser"
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";

const initialValues = {
  owner: "",
  petName: "",
  petAddress: "",
  ownerContact: "",
  ownerEmail: "",
  petBirth: "",
  petAge: "",
  sched_date: "",
  sched_time: "",
  notes: ""
};

const detailSchema = yup.object().shape({
  owner: yup.string().required("This field is required"),
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
  const [serbisyo, setServices] = useState("");
  const [stats, setStats] = useState("");

  //ETO NAMAN FOR THE CHANGING RADIO BUTTONS
  const handleRadio = (event) => {
    setStats(event.target.value);
  };

  //ETO YUNG KUNG MAGSEARCH NG PATIENT
  const search = async (name_search, pet_search) => {
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
      
      if(bookingData != null){
        const getService = await get(ref(db, "Bookings/" + bookingData.sched_date + "/" + name_search));
        setServices(getService.val().services);
        setStats(getService.val().status)
      }
      else{
        setServices("No current service")
      }
    

      const updatedIni = {
        petAddress: patientData.petAddress || "",
        changed: patientData.changed || "",
        ownerContact: patientData.ownerContact || "",
        ownerEmail: patientData.ownerEmail || "",
        petBirth: patientData.petBirth || "",
        owner: patientData.owner || "",
        petAge: patientData.petAge || "",
        petImage: patientData.petImage || "",
        sched_date: bookingData ? bookingData.sched_date || "No upcoming appointment" : "No upcoming appointment",
        sched_time: bookingData ? bookingData.sched_time || "No upcoming appointment" : "No upcoming appointment",
        notes: patientData.notes || ""
      };

      //for updating the fields with data taken from the database
      formikRef.current.setFieldValue("petAddress", updatedIni.petAddress);
      formikRef.current.setFieldValue("changed", updatedIni.changed);
      formikRef.current.setFieldValue("ownerContact", updatedIni.ownerContact);
      formikRef.current.setFieldValue("ownerEmail", updatedIni.ownerEmail);
      formikRef.current.setFieldValue("owner", updatedIni.owner);
      formikRef.current.setFieldValue("petBirth", updatedIni.petBirth);
      formikRef.current.setFieldValue("petAge", updatedIni.petAge);
      formikRef.current.setFieldValue("sched_date", updatedIni.sched_date);
      formikRef.current.setFieldValue("sched_time", updatedIni.sched_time);
      formikRef.current.setFieldValue("notes", updatedIni.notes)
      setImage(take.val().petImage);
      
      if (bookingData !== null) {
        if (bookingData.sched_time !== null || bookingData.sched_date !== null) {
          setBefore(bookingData.sched_date);
        } else {
      setBefore("")
        }
      } else {
     setBefore("")
      }

    } else {
      toast.error("Cannot find patient");
    }
  };

  //ETO NAMAN YUNG PARA SA PAG UPLOAD NG DATA IF MAY CHANGES
  const updateData = async (details) => {

    const currentDate = new Date();

    const userDate = new Date(details.sched_date);

    if(userDate >= currentDate){
      if (
        window.confirm(
          "Are you sure you want to reschedule the patient's booking?"
        )
      ) {
        if (details.sched_date !== null) {
          try {
            //this code is to remove the old booking
            remove(ref(db, "Bookings/" + beforeDate + "/" + details.owner));
            //this code is for updating the date ng patient
            update(ref(db, "Owners/"+ details.owner + "/Booking" ), {sched_date : details.sched_date, sched_time: details.sched_time})
            //eto ay i update ang booking para sa dashboard reference
            await update(
              ref(
                db,
                "Bookings/" +
                  details.sched_date +
                  "/" +
                  details.owner
              ),
              {
                services: serbisyo,
                ...details,
                status: stats,
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
                "service_n9xgj4k",
                "template_il5gkh8",
                templateParams,
                "URnwalukoM1o5-Oay"
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
    }
    else{
      toast.error("Date is invalid")
    }

   
  };

  const updateStatus = async (owner, pet, notes, date) => {
    await update(
      ref(
        db, 
        "Owners and Pets/" +
       owner + "/" +
       pet
      ),
      {
        notes: notes
      }
    )
    await update(
      ref(
        db,
        "Bookings/" +
          date +
          "/" +
          owner
      ),
      {
        status: stats,
      },
    ).then(() => {
      toast.success("Status updated")
    })
  }

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
                value={values.owner}
                onBlur={handleBlur}
                onChange={handleChange}
                label="Owner's Name"
                name="owner"
                error={!!touched.owner && !!errors.owner}
                helperText={touched.owner && errors.owner}
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
                onClick={() => search(values.owner, values.petName)}
              ></Button>
            </Box>
            <Box
              display="flex"
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
            </Box>
            <Box m="20px">
            <TextField
                variant="filled"
                fullWidth
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Notes"
                name="notes"
                value={values.notes}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
               <Box m="50px" display="flex" justifyContent="center">
                  <Typography 
                  variant="h2"
                  color={colors.eggshell[100]}
                  fontWeight="bold"
                  m="20px">
                    Current appointment details
                  </Typography>
                </Box>
              <Box display="flex">
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
                    sx={{ gridColumn: "span 1", maxWidth: "50%", marginRight: "15px" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Appointment time"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sched_time}
                    name="sched_time"
                    error={!!touched.sched_time && !!errors.sched_time}
                    helperText={touched.sched_time && errors.sched_time}
                    sx={{ gridColumn: "span 1", maxWidth: "50%", marginRight: "15px" }}
                  />
              </Box>

              <Box display="flex" marginTop="20px">
                <FormControl>
                    <FormLabel id="bookingsStats">Booking status</FormLabel>
                      <RadioGroup
                      aria-labelledby="description"
                      defaultValue="LB"
                      name="radio-buttons-group"
                      row
                      value={stats}
                      onChange={handleRadio}
                      >
                        <FormControlLabel value="appointed" control={<Radio />} label="Appointed" />
                        <FormControlLabel value="arrived" control={<Radio />} label="Arrived" />
                        <FormControlLabel value="ongoing" control={<Radio />} label="Ongoing" />
                        <FormControlLabel value="finished" control={<Radio />} label="Finished" />
                      </RadioGroup>
                 </FormControl>
                 <Button color="secondary" variant="contained" onClick={() => updateStatus(values.owner, values.petName, values.notes, values.sched_date)}>Update Status</Button>
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
                    onClick={() => handleDelete(values.owner, values.petName)}
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
