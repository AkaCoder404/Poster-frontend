import { Button } from 'antd';
import React from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import "./SuccessPage.css"

function SuccessPage() {

    const successIconStyle = {
        fontSize: "65px",
        color: 'rgba(95, 201, 145, 1)',
        backgroundColor: "white",
        boxShadow: '0 0 30px 5px rgba(95, 201, 145, 0.8)',
        borderRadius: "50%",
        marginBottom: "25px",
        marginTop: "25px"
    }

    let navigate = useNavigate();
    const onReturnClick = () => {
        console.log("Return button clicked");
        navigate("/");
    }


    return (
        <div className="SuccessPage">
           <div className="SuccessPage__content"> 
                <div className="SuccessPage__icon"><CheckCircleFilled style={successIconStyle}/></div>
                <div className="SuccessPage__title">Check your mailbox</div>
                <div className="SuccessPage__subtitle"> We have sent a confirmation email for your application. Please check your spam box in case you can't find it in your inbox </div>
                <Button className="SuccessPage__returnButton"
                    onClick={onReturnClick}> Return to homepage </Button>
           </div>
        </div>
    );
}

export default SuccessPage;