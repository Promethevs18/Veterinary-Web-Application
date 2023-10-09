import { Box, Button } from "@mui/material";
import React, { useEffect } from "react";
import Header from "../../components/Header";
import { DatePicker } from "antd";
import { useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import { toast } from "react-toastify";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import jsPDF from "jspdf";
import "jspdf-autotable";


const Lister = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const db = getDatabase();
  const { RangePicker } = DatePicker;
  const [dates, setDates] = useState([]);
  const ranges = [];
  const [presentPatients, setPatientPresent] = useState([]);
  var date = new Date().toLocaleString('en-intl',{
    month: 'short', year: 'numeric', day:'2-digit'
  });;

  //for the date range
  const dateChange = (values) => {
    if (values && values.length === 0) {
      // DatePicker inputs cleared
      setDates([]);
    } else if (values) {
      setDates(
        values.map((item) => {
          return new Date(item).toLocaleString('en-intl',{
            month: 'short', year: 'numeric', day:'2-digit'
          });;
        })
      );
    }
  };

  //para kunin ang ranges between two dates
  function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate);

    const dates = [];

    while (date <= endDate) {
      dates.push(new Date(date).toLocaleString('en-intl',{
        month: 'short', year: 'numeric', day:'2-digit'
      }));
      date.setDate(date.getDate() + 1);
    }
    for (let index = 0; index < dates.length; index++) {
      ranges.push(dates[index]);
    }
  }

  //Para mag-queue ng data from Firebase Attendance Table
  useEffect(() => {
    const d1 = new Date(dates[0]);
    const d2 = new Date(dates[1]);
    getDatesInRange(d1, d2);

    const patients = [];
    ranges.map((key) => {
      console.log(key)
      const getList = onValue(
        ref(db, "Bookings/" + key),
        (snapshot) => {
          snapshot.forEach((element) => {
            patients.push({
              id: element.key,
              ...element.val(),
            });
          });
          setPatientPresent(patients);
        },
        (error) => {
          toast.error(error);
        }
      );
      return () => {
        getList();
      };
    });
  });

  //ETO ANG RESPONSIBLE FOR EXPORTING TO PDF
  const exportPDF = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "landscape";

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Attendance from: " + dates[0] + " - " + dates[1];
    const headers = [
      [
        "OWNER NAME",
        "EMAIL",
        "PHONE NUMBER",
        "PET(S) BROUGHT",
        "SERVICE(S)",
        "APPOINTMENT DATE",
        "APPOINTMENT TIME",
      ],
    ];

    const data = presentPatients.map((present) => [
      present.owner,
      present.email,
      present.contact_num,
      present.patients,
      present.services,
      present.sched_date,
      present.sched_time,
    ]);

    let content = {
      startY: 90,
      head: headers,
      body: data,
    };

    doc.text("Exported by: Administrator", marginLeft, 70);
    doc.text("Exported at: " + date, 650, 70);

    doc.setFont("helvetica", "bold");
    doc.text(title, 250, 40);
    doc.autoTable(content);

    doc.save("Attendance from: " + dates[0] + " - " + dates[1]);
  };

  return (
    <Box m="20px">
      <Header
        title="Attendance Lister"
        subtitle="Here you can review the attendance for a date range you can choose. You can also export the data shown in PDF format"
      />
      <Box m="20px" display="flex" justifyContent="Center" alignItems="center">
        <RangePicker
          style={{
            background: colors.moss[400],
          }}
          onChange={dateChange}
        />
      </Box>
      <Box m="20px">
        <div className="board" style={{background: colors.moss[700]}}>
          <table width="100%">
            <thead>
              <tr>
                <td style={{ background: colors.eggshell[700] }}>Name</td>
                <td style={{ background: colors.eggshell[700] }}>Pet(s) Brought</td>
                <td style={{ background: colors.eggshell[700] }}>Contact Number</td>
                <td style={{ background: colors.eggshell[700] }}>
                  Date and Time
                </td>
                <td style={{ background: colors.eggshell[700] }}>Service/s</td>
              </tr>
            </thead>
            {presentPatients?.map((item) => (
              <tbody key={item.id}>
                <tr>
                  <td className="people">
                    <img src={item.imageUrl} alt={item.owner}></img>
                    <div className="people-de">
                      <h5 style={{ color: colors.eggshell[200] }}>
                        {item.owner}
                      </h5>
                    </div>
                  </td>
                  <td className="people-des">
                    <h5 style={{ color: colors.eggshell[200] }}>
                      {item.patients}
                    </h5>
                  </td>
                  <td className="active">
                    <p style={{ color: colors.eggshell[200] }}>{item.contact_num}</p>
                  </td>
                  <td className="active">
                    <p style={{ color: colors.eggshell[200] }}>
                      {item.sched_date}
                    </p>
                    <div>
                      <p style={{ color: colors.eggshell[200] }}>
                        {item.sched_time}
                      </p>
                    </div>
                  </td>
                  <td className="active">
                    <p style={{ color: colors.eggshell[200] }}>
                      {item.services}
                    </p>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </Box>

      <Box m="30px" display="flex" justifyContent="center">
        <Button variant="contained" color="secondary" onClick={exportPDF}>
          Export Data to PDF
        </Button>
      </Box>
    </Box>
  );
};

export default Lister;

//THIS PROJECT WAS MADE BY PROMETHEUS
