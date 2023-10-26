import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { auth } from "./firebase";
import About from "./scenes/about/about";
import AddService from "./scenes/addservice/AddService";
import Lister from "./scenes/attendanceLister/lister";
import Authentication from "./scenes/authentication/authentication";
import { default as Appointments, default as CreateAppointment, default as Dashboard } from "./scenes/dashboard/dashboard";
import Form from "./scenes/form/create_walkin";
import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import Team from "./scenes/patients/patients";
import Details from "./scenes/view_details/Details";
import { ColorModeContext, useMode } from "./theme";
import Feedbacks from "./scenes/feedbacks/Feedbacks";

function App() {
  const [theme, colorMode] = useMode();
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("Dashboard");

  //eto ang magchecheck if may user na nakalogin
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar setActive={setActive} active={active} user={user} />
          <main className="content">
            <Topbar />
            <ToastContainer position="top-center" theme="colored" transition={Zoom} autoClose={2000}/>
            <Routes setUser={user}>
              <Route
                path="/dashboard"
                element={<Dashboard setActive={active} user={user} active={active} />}
              />
              <Route
                path="/Appointments"
                element={<Appointments user={user} />}
              />
              <Route path="/patients" element={<Team user={user} />} />
              <Route
                path="/CreateAppointment"
                element={<CreateAppointment user={user} />}
              />
              <Route path="/about" element={<About user={user} />} />
              <Route path="/walk-in" element={<Form user={user} />} />
              <Route path="/" element={<Authentication setUser={setUser} setActive={setActive}/>} />
              <Route path="/details" element={<Details user={user} />} />
              <Route path="/lister" element={<Lister user={user} />} />
              <Route path="/addservice" element={<AddService user={user} />} />
              <Route path="/feedbacks" element={<Feedbacks user = {user} /> }/>
             
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

//THIS PROJECT WAS MADE BY PROMETHEUS
