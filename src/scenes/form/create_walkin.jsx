import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { getDatabase, ref, update } from "firebase/database";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialValues = {
  address: "",
  contact_num: "",
  email: "",
  owner: "",
  services: "",
};

const phoneRegExp =
  // eslint-disable-next-line
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

//this is for showing error sa form
const userSchema = yup.object().shape({
  address: yup.string().required("This field is required"),
  contact_num: yup
    .string()
    .matches(phoneRegExp, "Phone number is invalid")
    .required("This field is required"),
  email: yup.string().email("Invalid Email").required("This field is required"),
  owner: yup.string().required("This field is required"),
  patients: yup.string().required("This field is required"),
  sched_date: yup.string().required("This field is required"),
  services: yup.string().required("This field is required"),
});

//the main form
const Form = () => {
  const isNonMObile = useMediaQuery("(min-width:600px)");
  const db = getDatabase();
  const navigate = useNavigate();
  var date = new Date();

  var schedule_time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleFormSubmit = async (values) => {
    if (
      values.owner &&
      values.address &&
      values.patients &&
      values.services &&
      values.email &&
      values.contact_num !== null
    ) {
      try {
        await update(
          ref(
            db,
            "Bookings/" +
            date.toLocaleDateString("default", { month: "short", day: "2-digit" }) +
            ", " +
            date.getFullYear() +"/" +
            values.owner
          ),
          {
            ...values,
            sched_date:
              date.toLocaleDateString("default", { month: "short" }) +
              " " +
              date.getDate() +
              ", " +
              date.getFullYear(),
            sched_time: schedule_time,
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/vet-clinic-app-8203d.appspot.com/o/silhoutte.png?alt=media&token=ad21e101-55da-439f-85f3-c8bc3574f8d3",
          }
        );
        toast.success("Data has been uploaded in the database");
      } catch (error) {
        toast.error(error);
      }
    }
    navigate("/dashboard");
  };

  return (
    <Box m="20px">
      <Header
        title="CREATE WALK-IN"
        subtitle="Create a walk-in appointment"
        onSubmit={handleFormSubmit}
      />

      <Formik initialValues={initialValues} validationSchema={userSchema}>
        {({ values, errors, touched, handleBlur, handleChange }) => (
          <form onSubmit={handleFormSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMObile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Owner's Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.owner}
                name="ownerName"
                error={!!touched.owner && !!errors.owner}
                helperText={touched.owner && errors.owner}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact_num}
                name="contact_num"
                error={!!touched.contact_num && !!errors.contact_num}
                helperText={touched.contact_num && errors.contact_num}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Pet Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.patients}
                name="patients"
                error={!!touched.patients && !!errors.patients}
                helperText={touched.patients && errors.patients}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Services"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.services}
                name="services"
                error={!!touched.services && !!errors.services}
                helperText={touched.services && errors.services}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                onClick={() => handleFormSubmit(values)}
              >
                Create Walk-in Appointment
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;

//THIS PROJECT WAS MADE BY PROMETHEUS
