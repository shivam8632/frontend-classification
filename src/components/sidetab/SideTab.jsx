import React, {useState, useContext, useEffect} from 'react';
import UserContext from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { API } from '../../config/Api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane
  } from 'mdb-react-ui-kit';

function Copy() {
    const {pdfLabel, setPdfLabel, urlHistory, setUrlHistory, setUrlData,label, setText, token, questions, setQuestion, text, message, setMessage, fileCheck, setFileCheck, setPrimaryInput, URL, setUrl} = useContext(UserContext)
    const [loading, setLoading] = useState(false);
    const [basicActive, setBasicActive] = useState('tab1');
    console.log("label", label)
    console.log("FIle", fileCheck)

    const user =  localStorage.getItem("User_name");
    const checkAdmin = localStorage.getItem("Check_is_admin");
    const user_id = localStorage.getItem("User_ID");
    console.log("checkAdmin", checkAdmin);
    const navigate = useNavigate();
    const handleBasicClick = (value) => {
        if (value === basicActive) {
          return;
        }
    
        setBasicActive(value);
    };
    const handleFileChange = (e) => {
        setFileCheck(e.target.files[0]);
    };

    useEffect((() => {
        axios.get(API.BASE_URL + 'label/' + user_id)
        .then(function (response) {
            console.log("Questions", response);
            const filteredLabels = response.data.labels.filter(label => label !== "");
            setQuestion(filteredLabels);
        })
        .catch(function (error) {
            console.log(error);
        })
        axios.get(API.BASE_URL + 'urldata/')
        .then(function (response) {
            console.log("URL History", response);
            const filteredLabels = response.data.labels.filter(label => label !== "");
            setUrlHistory(filteredLabels);
        })
        .catch(function (error) {
            console.log(error);
        })
        axios.get(API.BASE_URL + 'pdfdata/')
        .then(function (response) {
            console.log("PDF Label", response);
            const filteredLabels = response.data.labels.filter(label => label.pdf_filename !== null || "");
            setPdfLabel(filteredLabels);
        })
        .catch(function (error) {
            console.log(error);
        })
    }), [])

    const handleScrapping = () => {
        setText('');
        const formData = new FormData();
        formData.append('url', URL);
        setLoading(true);
        axios.post(API.BASE_URL + 'adminscrapping/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(function (response) {
            setPrimaryInput('');
            console.log("Scrappingggg", response.data.message);
            setUrlData(response.data.message);
            setText(response.data.data);
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(() => setLoading(false));
      };
      
    useEffect(() => {
    console.log("Text in useEffect", text);
    }, [text]);
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleScrapping();
        }
    };

    const handleLogout = () => {
        axios.post(API.BASE_URL + 'logout/', {}, {
            headers: {
            Authorization: `Bearer ${token}`
        }})
        .then(function (response) {
            console.log("Logout", response);
            localStorage.clear();
            toast.success("User logged out")
            navigate('/');
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    const getFileContent = () => {
        setLoading(true);
    
        const formData = new FormData();
        formData.append('pdf', fileCheck);
        setPrimaryInput('');
    
        axios.post(API.BASE_URL + 'pdfresult/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(function (response) {
            console.log('Data', response);
            setMessage(response.data.message)
            axios.get(API.BASE_URL + 'pdfdata/')
            .then(function (response) {
                console.log("PDF Label", response);
                // const filteredLabels = response.data.labels.filter(label => label !== "");
                // setQuestion(filteredLabels);
            })
            .catch(function (error) {
                console.log(error);
            })
            
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(() => setLoading(false));
      };
      console.log("URLHOSTORY", urlHistory)
    

  return (
    <div className="copy d-flex h-100 flex-column justify-content-between" id="left-tabs-example">

{loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}


        <p className='text-white user'>Welcome, <strong>{user? user : 'User'}</strong></p>
        {checkAdmin != 'true' ? (
            questions?.length > 0 ? (
                <ul className='p-4'>
                    {questions?.map((text) => {
                        return(
                            <li className='text-white d-flex align-items-center mb-4' style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}> <FontAwesomeIcon 
                            icon={faMessage}
                            style={{
                                color: "#fff",
                                width: "15px",
                                height: "15px",
                                marginRight: 10
                            }}
                            /> {text}</li>
                        )
                    })}
                </ul>
            ) : (<p className='mb-0 d-flex h-100 justify-content-center align-items-center fs-6' style={{color: '#6c6c72'}}>No Search History</p>)
        ) : (
            <>
            <MDBTabs className='mb-3'>
                <MDBTabsItem>
                <MDBTabsLink onClick={() => handleBasicClick('tab1')} active={basicActive === 'tab1'}>
                    Tab 1
                </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                <MDBTabsLink onClick={() => handleBasicClick('tab2')} active={basicActive === 'tab2'}>
                    Label
                </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                <MDBTabsLink onClick={() => handleBasicClick('tab3')} active={basicActive === 'tab3'}>
                    PDF
                </MDBTabsLink>
                
                </MDBTabsItem>
                <MDBTabsItem>
                <MDBTabsLink onClick={() => handleBasicClick('tab4')} active={basicActive === 'tab4'}>
                    URL History
                </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>
            

            <MDBTabsContent>
                <MDBTabsPane show={basicActive === 'tab1'}>
                    <div className='input-list' style={{padding: 15}}>
                <div className="input-container">
                    <label className='text-white mb-3'>URL Scrapping</label>
                    <input className='w-100' type="url" placeholder='Enter a URL' onChange={(e) => {setUrl(e.target.value)}} onKeyDown={handleKeyPress} />
                    <button type='button' className='scrap' onClick={() => handleScrapping()}>Enter</button>
                </div>
                
                <div className="input-container mt-4">
                    <label className='text-white mb-3'>Upload</label>
                    <input
                        className='w-100 text-white'
                        type="file"
                        accept="image/*, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf"
                        onChange={handleFileChange}
                    />
                <button type='button' className='scrap' onClick={getFileContent}>Upload</button>
                </div>
            </div>
                </MDBTabsPane>
                <MDBTabsPane show={basicActive === 'tab2'}>
                    <>
                    
                        {questions?.length > 0 && (
                            <ul className='p-4'>
                                {questions?.map((text) => {
                                    return(
                                        <li className='text-white d-flex align-items-center mb-4' style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}> <FontAwesomeIcon 
                                        icon={faMessage}
                                        style={{
                                            color: "#fff",
                                            width: "15px",
                                            height: "15px",
                                            marginRight: 10
                                        }}
                                        /> {text}</li>
                                    )
                                })}
                            </ul>
                        )}
                    
                    </>
                </MDBTabsPane>
                <MDBTabsPane show={basicActive === 'tab3'}>
                <ul className="p-4">
                        {pdfLabel?.map((history, i) => {
                            return(
                                <li className='text-white d-flex align-items-center mb-4' style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}> <FontAwesomeIcon 
                                        icon={faMessage}
                                        style={{
                                            color: "#fff",
                                            width: "15px",
                                            height: "15px",
                                            marginRight: 10
                                        }}
                                        />{history.pdf_filename}</li>
                            )
                        })}
                    </ul>
                </MDBTabsPane>
                <MDBTabsPane show={basicActive === 'tab4'}>
                    <ul className="p-4">
                        {urlHistory?.map((history, i) => {
                            return(
                                <li className='text-white d-flex align-items-center mb-4' style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}> <FontAwesomeIcon 
                                        icon={faMessage}
                                        style={{
                                            color: "#fff",
                                            width: "15px",
                                            height: "15px",
                                            marginRight: 10
                                        }}
                                        />{history.url}</li>
                            )
                        })}
                    </ul>
                </MDBTabsPane>
            </MDBTabsContent>
            </>
        )}
        <div className="logout mt-auto">
            <button type='button' className='button' onClick={() => {handleLogout()}}>Logout</button>
        </div>
    </div>
  )
}

export default Copy