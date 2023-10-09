import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { get, getDatabase, onValue, query, ref } from "firebase/database";


const Feedbacks = () =>{

    //assign an array to hold all feedbacks taken from the database
    const [allFeeds, setFeeds] = useState([])
    //get database Reference
    const db = getDatabase();

    //queue request to the feedbacks database
    useEffect(() => {
        let feeds = []

        const feedbacks = ref(db, "Owners");
        const feedbackQuery = query(feedbacks);

        get(feedbackQuery).then((snappy) => {
            if(snappy.exists()){
                snappy.forEach((element)=>{
                    feeds.push({
                        id: element.key,
                        ...element.child("Feedback").val()
                    })
                })
              console.log(feeds)
              setFeeds(feeds)
            }
            else
            {
            console.log("No data found")    
            }
        }).catch((error) =>{
            console.log(error)
        })
    },[db])

    // THE HTML PART NG ATING CODES
    return(
      <Box m="20px">
        <Header
            title="VIEW USER FEEDBACKS"
            subtitle="This interface displays all user feedbacks about the application, service, and overall experience"
        />

        <Box display="space-around" justifyContent="center" m="10px">
        <div className="index">
          <div className="group-wrapper">
            
          {allFeeds?.map((feedbacks) => (
                feedbacks.feed_con?(
             <div className="group" key={feedbacks.id}>
                   <div className={`overlap-group ${feedbacks.feed_con.length > 20 ? 'multi-line' : ''}`}>
                     <img
                     className="screenshot"
                     alt="Screenshot"
                     src = "https://firebasestorage.googleapis.com/v0/b/vet-clinic-app-8203d.appspot.com/o/AniCare-Logo---1.png?alt=media&token=98d1dbd0-6732-4756-88ce-9d377973293d&_gl=1*2gxi1y*_ga*OTc5MjU5NDA0LjE2OTY4MjM3NjY.*_ga_CW55HF8NVT*MTY5NjgzMTgwNy4yLjEuMTY5NjgzMTgxOS40OC4wLjA."
                     />
                 <div className="text-wrapper">{feedbacks.feed_sub}</div>
                 <div className="div">{feedbacks.stars}</div>
                     <img
                     className="star"
                     alt="Star"
                     src="https://cdn.animaapp.com/projects/63ef295198de32149d38e038/releases/652388bbddab0630af6ff612/img/star-1.svg"
                     />
                <div className="text-wrapper-2">{feedbacks.feed_con}</div>
           </div>
               </div>
            ):null
        ))}
            
      </div>
    </div>
        </Box>
    </Box>
    )
}
export default Feedbacks;