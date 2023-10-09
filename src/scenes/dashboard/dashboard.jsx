import { Box, Button, IconButton, List, ListItem, ListItemText, Typography, duration, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { equalTo, get, getDatabase, onValue, query, ref, once } from "firebase/database";
import Spinner from "../Spinner";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import { formatDate } from "@fullcalendar/core";
import timeGrid from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import { ResponsivePie } from "@nivo/pie";


const Dashboard = ({ user }) => {
  //eto ang mga declarations for Time and date
  let time = new Date().toLocaleTimeString();
  let date = new Date().toDateString();

  toast.success(user);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  const db = getDatabase();
  const [presentList, setPresentList] = useState([]);
  const [count, setCount] = useState(time);
  const [dateToday, setDate] = useState(date);
  const [overall, setOverAll] = useState([]);
  const [allBreeds, setAllBreeds] = useState([])
  const [petAddress, setPetAddress] = useState([])

  //time updater
  const UpdateTime = () => {
    time = new Date().toLocaleTimeString();
    setCount(time);
  };

  //date updater
  const UpdateDate = () => {
    date = new Date().toLocaleString('en-intl',{
      month: 'short', year: 'numeric', day:'2-digit'
    });
    setDate(date);
  };

  setInterval(UpdateDate, 1000);
  setInterval(UpdateTime, 1000);

  //taking the bookings from the database
  useEffect(() => {
    let present = [];
    const getPresent = onValue(
      ref(db, "Bookings/" + dateToday, dateToday),
      (snapshot) => {
        snapshot.forEach((element) => {
          present.push({
            id: element.key,
            ...element.val(),
          });
        });
        setPresentList(present);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      getPresent();
    };
  });

  //para eto sa pag lagay ng values sa calendar
  useEffect(() => {
    let all = [];
    const getAll = onValue(
      ref(db, "Bookings/"), (snapshot) =>{
        snapshot.forEach((element) =>{
          element.forEach((valuables) =>{
            all.push({
              id: valuables.key,
              ...valuables.val(),
            })
          })
        })
        setOverAll(all);
      },
      (error) =>{
        console.log(error)
      }
    );
    return () => {
      getAll();
    }
  })


  //FOR ANALYTICS
  //This is to get all the pets and their count 
  useEffect(() =>{
    const getAll = onValue(ref(db, "Owners and Pets/"),
    (snapshot) =>{
      
      const breedCounts = [];

      snapshot.forEach((elemento) =>{
        elemento.forEach((element)=>{
          const breed = element.child("breed").val();
          if(breed){
            if(breedCounts[breed]){
              breedCounts[breed] += 1;
            }
            else{
              breedCounts[breed] = 1;
            }
          }
        });
      });

      const uniquesArray = [];
      
      for(const breed in breedCounts){
        uniquesArray.push({id: breed, value: breedCounts[breed]});
      }

      setAllBreeds(uniquesArray);

    }, (error) =>{
      console.log(error)
    })

  },[])

  //This is to get all the pet's addresses and their count
  useEffect(() =>{
    const getAll = onValue(ref(db, "Owners and Pets/"),
    (snapshot) =>{
      
      const addressCount = [];
      snapshot.forEach((elemento) =>{
        elemento.forEach((element)=>{
          const addresses = element.child("petAddress").val();
          if(addresses){
            if(addressCount[addresses]){
              addressCount[addresses] += 1;
            }
            else{
              addressCount[addresses] = 1;
            }
          }
        });
      });

      const uniquesArray = [];

      for(const addresses in addressCount){
        uniquesArray.push({id: addresses, value: addressCount[addresses]});
      }
      setPetAddress(uniquesArray);

    }, (error) =>{
      console.log(error)
    })

  },[])


  //loading updater
  if(loading){
    return(
      <div className="home">
        <Spinner/>
      </div>
    )
  }

  return (
    <Box m="20px">
      {/* HEADER */}
         <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
     {/* Appointments */}
      <Box className="container">
        <div>
          <h1 className="clock">{dateToday}</h1>
          <Box justifyContent="space-around" display="flex">
              <Typography 
                variant = "h2"
                color = {colors.eggshell[100]}
                fontWeight="bold"
                sx={{m:"5px 0 0 0"}}>
                  Pets Breed Chart
                </Typography>
              <Typography
                  variant = "h2"
                  color = {colors.eggshell[100]}
                  fontWeight="bold"
                  sx={{m:"5px 0 0 0"}}>
                    Pets Addresses
              </Typography>
            </Box>
           <Box height="250px" justifyContent="space-evenly" display="flex">
      {/*Pie*/}
        <ResponsivePie
          data={allBreeds}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: colors.bud[100],
                },
              },
              legend: {
                text: {
                  fill: colors.bud[100],
                },
              },
              ticks: {
                line: {
                  stroke: colors.bud[100],
                  strokeWidth: 1,
                },
                text: {
                  fill: colors.bud[100],
                },
              },
            },
            legends: {
              text: {
                fill: colors.bud[100],
              },
            },
          }}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={colors.bud[100]}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={colors.bud[100]}
          arcLabelsRadiusOffset={0.4}
          arcLabelsSkipAngle={7}
          arcLabelsTextColor="black"
          isInteractive = {false}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: colors.bud[100],
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: colors.bud[100],
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
        /> 

        <ResponsivePie
        data={petAddress}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.bud[100],
              },
            },
            legend: {
              text: {
                fill: colors.bud[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.bud[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.bud[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.bud[100],
            },
          },
        }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={colors.bud[100]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={colors.bud[100]}
        arcLabelsRadiusOffset={0.4}
        arcLabelsSkipAngle={7}
        arcLabelsTextColor="black"
        isInteractive = {false}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: colors.bud[100],
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: colors.bud[100],
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
      /> 
        
    </Box>
          <div className="board" style={{background: colors.moss[700]}}>
            <table width="100%">
              <thead>
                <tr>
                  <td style={{ background: colors.bud[700] }}>Name</td>
                  <td style={{ background: colors.bud[700] }}>
                    Scheduled Time
                  </td>
                  <td style={{ background: colors.bud[700] }}>
                    Scheduled Date
                  </td>
                  <td style={{ background: colors.bud[700] }}>
                    Service Selected
                  </td>
                </tr>
              </thead>
              {presentList?.map((item) => (
                <tbody key={item.id}>
                  <tr>
                    <td className="people">
                      <img src={item.imageUrl} alt={item.owner}></img>
                      <div className="people-de">
                        <h5 style={{ color: colors.taupe[200] }}>
                          {item.owner}
                        </h5>
                        <p style={{ color: colors.taupe[200] }}>{item.patients}</p>
                      </div>
                    </td>
                    <td className="people-des">
                      <h5 style={{ color: colors.taupe[200] }}>
                        {item.sched_time}
                      </h5>
                    </td>
                    <td className="active">
                      <p style={{ color: colors.taupe[200] }}>
                        {item.sched_date}
                      </p>
                    </td>
                    <td className="active">
                      <p style={{ color: colors.taupe[200] }}>
                        {item.services}
                      </p>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </Box>
      {/* CALENDAR STUFF */}
      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box flex="1 1 20%" backgroundColor={colors.moss[700]} p="15px" borderRadius="4px">
        <Typography variant="h5" color={colors.bud[200]}>Appointments for Today</Typography>
        <List>
          {presentList?.map((bookings) => ( 
            <ListItem key={bookings.id} sx={{background: colors.moss[500], margin:"10px 0", borderRadius:"2px"}}>
              <ListItemText primary={bookings.owner} secondary={
                <Typography>
                  {formatDate(bookings.sched_date, {
                    month: 'short', year: 'numeric', day:'2-digit'
                  })}
                  {bookings.sched_date} : {bookings.sched_time}
                </Typography>
              }>

              </ListItemText>
            </ListItem>
          ))}
        </List>
        </Box>
        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
        <FullCalendar
          height="75vh"
          plugins={[dayGridPlugin,
            timeGrid,
            listPlugin,]}
          initialView="timeGrid"
          headerToolbar={{
            left: "prev, next",
            center: "title",
            right: "timeGridWeek, timeGridDay"
          }}
          duration={{days: 5}}
          dayMaxEvents={false}
          events={overall?.map((books) => {
            const parsedDate = new Date(books.sched_date);
            const [hours, minutes] = books.sched_time.split(":"); 
            if (!isNaN(parsedDate.getTime()) && hours && minutes) {
              parsedDate.setHours(parseInt(hours));
              parsedDate.setMinutes(parseInt(minutes));
              return {
                title: books.ownerName,
                start: parsedDate.toISOString(),
              };
            }
            return null; 
          }).filter(event => event !== null)}
          
        />
        </Box>

      </Box>

    </Box>
  );
};

export default Dashboard;

//THIS PROJECT WAS MADE BY PROMETHEUS
