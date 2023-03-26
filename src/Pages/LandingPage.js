import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from 'antd';
import cover from "../assets/images/cover_with_text2.png";
import './LandingPage.css';

function formatTimeValue(value) {
    if (value < 10) {
      return `0${value}`;
    } else {
      return value.toString();
    }
  }

// const days = "00";
// const hours = "00";
// const minutes = "00";
// const seconds = "00";
function LandingPage() {
    const [days, setDays] = React.useState("00");
    const [hours, setHours] = React.useState("00");
    const [minutes, setMinutes] = React.useState("00");
    const [seconds, setSeconds] = React.useState("00");

    let navigate = useNavigate();
    // Somewhere in your code, e.g. inside a handler:
  
    // Function after clicking the register button
    const onRegisterClick = () => {
        console.log("Register button clicked");
        navigate("/register"); 
    }

    useEffect(() => {
          // Calculate the time remaining until the target date
    const targetDate = new Date("2023-04-09T00:00:00");
    const now = new Date();
    const timeDiff = targetDate.getTime() - now.getTime();

    // Calculate the number of days, hours, minutes, and seconds left
    let remainingTime = timeDiff / 1000; // convert to seconds
    const remainingDays = Math.floor(remainingTime / (24 * 60 * 60));
    remainingTime -= remainingDays * 24 * 60 * 60;
    const remainingHours = Math.floor(remainingTime / (60 * 60));
    remainingTime -= remainingHours * 60 * 60;
    const remainingMinutes = Math.floor(remainingTime / 60);
    remainingTime -= remainingMinutes * 60;
    const remainingSeconds = Math.floor(remainingTime);

    // Update the state variables with the new values
    setDays(formatTimeValue(remainingDays));
    setHours(formatTimeValue(remainingHours));
    setMinutes(formatTimeValue(remainingMinutes));
    setSeconds(formatTimeValue(remainingSeconds));

    // Set up the interval to update the countdown every second
    const intervalId = setInterval(() => {
      // Calculate the new values for days, hours, minutes, and seconds
      let newSeconds = seconds - 1;
      let newMinutes = minutes;
      let newHours = hours;
      let newDays = days;
      
      if (newSeconds < 0) {
        newSeconds = 59;
        newMinutes--;
      }
      if (newMinutes < 0) {
        newMinutes = 59;
        newHours--;
      }
      if (newHours < 0) {
        newHours = 23;
        newDays--;
      }

      // Update the state variables with the new values
      setDays(newDays);
      setHours(newHours);
      setMinutes(newMinutes);
      setSeconds(newSeconds);

      // Stop the interval when the countdown reaches zero
      if (newDays === 0 && newHours === 0 && newMinutes === 0 && newSeconds === 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [days, hours, minutes, seconds]);


    return (
        <div className="LandingPage">
            <div className="cover">
                {/* <div className='cover-date'> March 27 - April 9 2023 </div>
                <div className="cover-title"> POSTER SESSION </div>
                <div className="cover-subtitle"> International Congress of Basic Science </div> */}
                <img id="cover" src={cover} alt="cover" style={{ width: '100%' }} />
            </div>
            <div className="countdown">
                <div className='countdown-divider'></div>
                <div className='countdown-time'>
                    <div className='countdown-timer'> {days} </div>
                    <div className='countdown-label'> days </div>
                </div>
                <div className='countdown-divider'></div>
                <div className='countdown-time'>
                    <div className='countdown-timer'> {hours} </div>
                    <div className='countdown-label'> hours </div>
                </div>
                <div className='countdown-divider'></div>
                <div className='countdown-time'>
                    <div className='countdown-timer'> {minutes} </div>
                    <div className='countdown-label'> minutes </div>
                </div>
                <div className='countdown-divider'></div>
                <div className='countdown-time'>
                    <div className='countdown-timer'> {seconds} </div>
                    <div className='countdown-label'> seconds </div>
                </div>
                <div className='countdown-divider'></div>
                <Button 
                    // type="primary" 
                    size="large" 
                    className="countdown-button" 
                    onClick={onRegisterClick}>
                        REGISTER</Button>
            </div>

            <div className="LandingPage-info">
                <div className="LandingPage-info-subtitle"> Poster Session </div>
                <div className="LandingPage-info-title"> ABOUT THE CONFERENCE </div>
                <div className="LandingPage-info-text"> A half day poster session will be held during the inaugural International Congress of Basic Science (ICBS). This is an opportunity for worldwide outstanding undergraduate and graduate students to display and introduce their recent works, to communicate and discuss with various fields of mathematicians and scholars. The congress will provide up to 25000RMB economic airfare support and accommodation (shared room) for every successful applicant. </div>
            </div>

            <div className="LandingPage-requirement">
                <div className="LandingPage-requirement-title"> REQUIREMENTS </div>
                <div className='LandingPage-requirements'>
                    <div className="LandingPage-info-requirement">  1. Major in Mathematics and its interdisciplinary subjects. </div>
                    <div className="LandingPage-info-requirement">  2. Worldwide outstanding undergraduate and graduate students with affiliations. </div>
                    <div className='LandingPage-info-requirement'>  3. Juvenile under 18 will not be considered.  </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;