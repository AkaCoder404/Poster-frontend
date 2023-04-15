import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import "./SuccessPage.css"

function SuccessPage() {
    const location = useLocation();
    // eslint-disable-next-line
    const [currentUrl, setCurrentUrl] = useState(window.location.href);
    const urlWithoutSuccess = currentUrl.replace('success', 'register');
    // eslint-disable-next-line
    const [uuid, setUuid] = React.useState(null);

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
        navigate("/postersession");
    }


    // eslint-disable-next-line
    const loadData = (uuid) => {}

    // eslint-disable-next-line
    useEffect(() => {
        console.log("Page Loaded");
        const searchParams = new URLSearchParams(location.search);
        console.log("Url Params: ", searchParams.get('uuid'));

        // TODO: Check if uuid is valid
        if (searchParams.get('uuid') !== null) {
            loadData(searchParams.get('uuid'));
            setUuid(searchParams.get('uuid'));
        } else {
            // TODO: Redirect to homepage
            console.log("Invalid uuid");
            navigate("/postersession");
        }
    }, [location.search, navigate, loadData]);

    return (
        <div className="SuccessPage">
           <div className="SuccessPage__content"> 
                <div className="SuccessPage__icon"><CheckCircleFilled style={successIconStyle}/></div>
                <div className="SuccessPage__title">Save this link!</div>
                <div className="SuccessPage__subtitle"> Please save <a href={urlWithoutSuccess} style={{color: "#FEC317"}}>this</a> link to review your application: <br/> {urlWithoutSuccess} </div>
                <Button className="SuccessPage__returnButton"
                    onClick={onReturnClick}> Return to homepage </Button>
           </div>
        </div>
    );
}

export default SuccessPage;