import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const initialValues = {
  email: "",
  password: "",
};

const userSchema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("This field is required"),
  password: yup.string().required("This field is required"),
});

const Authentication = ({ setUser, setActive }) => {
  const navigate = useNavigate();
  const handleFormSubmit = async (values) => {
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
        onSubmit={handleFormSubmit}
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
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Authentication;

//THIS PROJECT WAS MADE BY PROMETHEUS
