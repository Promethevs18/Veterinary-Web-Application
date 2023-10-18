import { Box, Button, TextField, useScrollTrigger } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useState } from "react";

const initialValues = {
  email: "",
  password: "",
  answer: ""
};

const userSchema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("This field is required"),
  password: yup.string().required("This field is required"),

});

const Authentication = ({ setUser, setActive }) => {
  const navigate = useNavigate();
  const [securityShow, setSecurityShow] = useState(false)
  const [securityValue, setSecurityValue] = useState("");

  const showQuestion = () =>{
    setSecurityShow(true)
  }

  const handleValueChange = (event) =>{
    setSecurityValue(event.target.value)
  }
  const handleFormSubmit = async (values) => {
    
    if(securityValue === "Name"){
      const { user } = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      ).catch((error) => {
        toast.error(error.message);
      });
      toast.success("You have successfully signed in");
      navigate("/dashboard");
      setUser(user);
      setActive("Dashboard");
    }
    else{
      toast.error("Security answer unaccepted. Try again")
    }
   
  };

  return (
    <Box m="20px">
      <Header
        title="AUTHENTICATION PAGE"
        subtitle="Sign in to the website to access administrator features"
      />

      <Formik
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={showQuestion}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => (
          <Form>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Sign in
              </Button>
            </Box>
            {securityShow ? (
              <Box m="20px" display="flex" justifyContent="center">
                <Box m="20px" display="grid">
                    <Box m="20px" fontSize="15px">Security Question: What do you have, but people use it more than you do?
                    </Box>
                    {<TextField
                    variant="filled"
                    type="text"
                    value={securityValue}
                    name="securityValue"
                    onChange={handleValueChange}
                    />}
                       <Button color="secondary" variant="contained" onClick={() => handleFormSubmit({email: values.email, password: values.password})}>
                          Confirm Answer
                      </Button>
                </Box>
             
              </Box>
            ): null}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Authentication;

//THIS PROJECT WAS MADE BY PROMETHEUS
