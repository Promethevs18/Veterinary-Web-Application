import React, { useRef } from "react";
import { Box, Avatar, Button, TextField, FormLabel, colors, useTheme, RadioGroup, FormControlLabel, Radio, FormControl } from "@mui/material";
import Header from "../../components/Header";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { tokens } from "../../theme";
import { useState } from "react";
import { toast } from "react-toastify";
import {ref as ref_storage, getDownloadURL, uploadBytesResumable} from "firebase/storage"
import { db, storage } from "../../firebase";
import {getDatabase, ref as ref_database, update } from "firebase/database"


const AddService = () => {

  const initialValues = {
    veterinary_name: "",
    short_desc: "",
    price: "",
    veterinary_image: "",
    category: ""
  };

  const formikRef = useRef(null);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("https://www.pngall.com/wp-content/uploads/2/Upload-Transparent.png");
  const database = getDatabase();


  const validation = yup.object().shape({
    veterinary_name: yup.string().required("This field is required"),
    price: yup.string().required("This field is required"),
    short_desc: yup.string().required("This field is required")  });



  //this is to upload the information to firebase database
  const addSerbisyo = (values) => {
    if(values.veterinary_name != null && values.short_desc != null){
      try{
        update(
          ref_database(database, "Services/" + category + "/" + values.veterinary_name),
          {...values,
            category: category,
            veterinary_image: image,

          }
        )
      } catch(mali){
        toast.error("Error uploading data due to: " , mali)
      }
    }
    toast.success("Service added successfully!");
  };

  const handleRadioChange = (event) => {
    setCategory(event.target.value);
  
  };

  //this is to upload the image to the database
  const uploadImage = (nakuha) => {
    toast.info("File uploading...");
    const uploadFile =() =>{
      const storageRef = ref_storage(storage, "Vet_Services/" + nakuha.name);
      const uploadTask = uploadBytesResumable(storageRef, nakuha);
      uploadTask.on("state_changed", (snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        toast.info("Upload is " + progress + " % done")
      }, (error) =>{
        toast.error(error)
      }, () =>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>{
          toast.success("Image uploaded to the database successfully!");
          setImage(downloadUrl)
        })
      })
    }
    nakuha && uploadFile()
  }

  

  return (
    <Box m="20px">
      {/* HEADER */}
      <Header title="ADD A SERVICE" subtitle="Add the services you offer here - or omit those that you no longer serve" />

      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validation}
        onSubmit={addSerbisyo}
      >
        {({values, errors, touched, handleBlur, handleChange}) =>(
            <Form>
                <Box display="flex" justifyContent="center" m="20px">
                      <input
                          type="file"
                          style={{display: "none"}}
                          id="imageUpload"
                          accept="image/*"
                          onChange={(e) => uploadImage(e.target.files[0])}
                        />
                    <Avatar
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            height: "30%",
                            width: "30%",
                        }}
                        alt = "service-image"
                        src = {image}
                        onClick={() => {
                          document.getElementById("imageUpload").click();
                        }}
                        />
                       
                </Box>
                <Box display="flex" justifyContent="start" m="20px">
                     <TextField
                        variant="filled"
                        fullWidth
                        type="text"
                        value={values.veterinary_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Service Name"
                        name="veterinary_name"
                        error={!!touched.veterinary_name && !!errors.veterinary_name}
                        helperText={touched.veterinary_name && errors.veterinary_name}
                        sx={{ maxWidth: "50%", marginRight: "15px" }}
                     />
                     <TextField
                        variant="filled"
                        fullWidth
                        type="text"
                        value={values.short_desc}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label = "Short Description of service"
                        name="short_desc"
                        error={!!touched.short_desc && !! errors.short_desc}
                        helperText={touched.short_desc && errors.short_desc}
                        sx={{maxWidth: "50%", marginLeft: "15px"}}
                     />
                </Box>
                <Box display="flex" justifyContent="space-evenly" m="20px">
                    <FormControl>
                       <FormLabel id="service-category" color="success">Service Category</FormLabel>
                           <RadioGroup
                            row
                            aria-labelledby="service-category"
                            name="row-radio-buttons-group"
                            value={category}
                            onChange={handleRadioChange}
                           >
                              <FormControlLabel value="Grooming" control={<Radio color="reddish"/>} label="Grooming" />
                              <FormControlLabel value="Veterinary" control={<Radio color="reddish" />} label="Veterinary" />
                              <FormControlLabel value="Others" control={<Radio color="reddish" />}  label="Others" />
                          </RadioGroup>
                    </FormControl>                      
                    <TextField
                        variant="filled"
                        fullWidth
                        type="text"
                        value={values.price}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label = "Price of Service"
                        name="price"
                        error={!!touched.price && !! errors.price}
                        helperText={touched.price && errors.price}
                        sx={{maxWidth: "25%", marginLeft: "15px"}}
                     />
                </Box>
                  <Box display="flex" justifyContent="center" m="20px">
                    <Button
                     variant="contained"
                     color = "secondary"
                     onClick={() => addSerbisyo(values)}
                    >
                      Add Service to the Database
                    </Button>
                  </Box>
            </Form>
        )}
    
      </Formik>
    </Box>
  );
};

export default AddService;
