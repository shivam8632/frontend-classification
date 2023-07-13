import React, {useState, useContext, useEffect} from 'react';
import UserContext from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faShareFromSquare, faDownload, faShare, faTrash, faClose } from "@fortawesome/free-solid-svg-icons";
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
    const {selectedValue, setSingleLabelId, setSelectedValue, pdfLabel, setPdfLabel, urlHistory, setUrlHistory, setUrlData,label, setText, token, questions, setQuestion, text, message, setMessage,setNewText, newText, fileCheck, setResponseFrom, setPredictionQues, setFileCheck, setPrimaryInput, URL, setUrl,pdfData, setPdfData, questionId, setQuestionId, selectedQuestions, setSelectedQuestions} = useContext(UserContext)
    const [loading, setLoading] = useState(false);
    const [basicActive, setBasicActive] = useState('tab1');
    const [activeId, setActiveId] = useState(null);
    const [pdfLink, setPdfLink] = useState([]);
    const [labelDelId, setLabelDelId] = useState('');
    const [isContentVisible, setContentVisible] = useState(false);
    console.log("label", label)
    console.log("FIle", fileCheck)

    const user =  localStorage.getItem("User_name");
    const checkAdmin = localStorage.getItem("Check_is_admin");
    const user_id = localStorage.getItem("User_ID");
    console.log("checkAdmin", isContentVisible);
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

    const handleScrapping = () => {
        setText('');
        setPdfData('')
        setSelectedQuestions([])
        const formData = new FormData();
        formData.append('url', URL);
        formData.append('database_id', selectedValue)
        setLoading(true);
        axios.post(API.BASE_URL + 'adminscrapping/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(function (response) {
            setPrimaryInput('');
            console.log("Scrappingggg", response);
            setUrlData(response.data.QA_Pairs);
            // setText(response.data.QA_Pairs);
            axios.post(API.BASE_URL + 'urldata/', {
                database_id: selectedValue
            })
            .then(function (response) {
                console.log("URL History", response);
                const filteredLabels = response.data.labels.filter(label => label !== "");
                setUrlHistory(filteredLabels);
            })
            .catch(function (error) {
                console.log(error);
                if(response.data.message == "url is required") {
                    toast.warn("Please enter the url")
                }
            })
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(() => setLoading(false));
    };

    const handleTrainData = (e) => {
        if(selectedValue != null) {
            setLoading(true);
        axios.post(API.BASE_URL + 'finaltrainmodel/', {
            database_id: selectedValue,
            })
        .then(function (response) {
            console.log("Train Data", response.data);
            toast.success("Model Trained Successfully")
        })
        .catch(function (error) {
            console.log(error)
            toast.error('Error to train data')
        })
        .finally(() => setLoading(false))
        }
        else {
            toast.warn("Please select a database")
        }
    }

    const handleButtonClick = (value) => {
        setSelectedValue(value);
        toast.success("Database " + value + 'selected')
        axios.post(API.BASE_URL + 'label/', {
            database_id: value
        })
        .then(function (response) {
            console.log("Questions", response);
            setQuestion(response.data.unique_label);
            setQuestionId(response.data.unique_id)
        })
        .catch(function (error) {
            console.log(error);
        })

        axios.post(API.BASE_URL + 'urldata/', {
            database_id: value
        })
        .then(function (response) {
            console.log("URL History", response);
            const filteredLabels = response.data.labels.filter(label => label !== "");
            setUrlHistory(filteredLabels);
        })
        .catch(function (error) {
            console.log(error);
        })
        axios.post(API.BASE_URL + 'pdfdata/', {
            database_id: value
        })
        .then(function (response) {
            console.log("PDF Label", response);
            const filteredLabels = response.data.pdffilename.filter(label => label !== null || "");
            setPdfLabel(filteredLabels);
            const filteredPdfLink = response.data.pdfdownload.filter(label => label !== null || "");
            setPdfLink(filteredPdfLink);
        })
        .catch(function (error) {
            console.log(error);
        })
    };

    console.log("selectedValue" ,selectedValue)
      
    useEffect(() => {
    console.log("Text in useEffect", text);
    }, [text]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleScrapping();
        }
    };

    const handleLogout = () => {
        setUrl('');
        setFileCheck('')
        setMessage('');
        setUrlData('');
        setPdfData('')
        setNewText('')
        setPredictionQues('')
        setPrimaryInput('')
        setResponseFrom('')
        localStorage.clear();
        toast.success("User logged out")
        navigate('/');
        window.location.reload();
        //     navigate('/');
        // axios.post(API.BASE_URL + 'logout/', {}, {
        //     headers: {
        //     Authorization: `Bearer ${token}`
        // }})
        // .then(function (response) {
        //     console.log("Logout", response);
        //     localStorage.clear();
        //     toast.success("User logged out")
        //     navigate('/');
        // })
        // .catch(function (error) {
        //     console.log(error);
        // })
    }

    const getFileContent = () => {
        setLoading(true);
        setSelectedQuestions([])
        setUrlData('')
        const formData = new FormData();
        formData.append('pdf', fileCheck);
        formData.append('database_id', selectedValue)
        setPrimaryInput('');
    
        axios.post(API.BASE_URL + 'pdfresult/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(function (response) {
            console.log('PDF Data', response);
            setMessage(response.data.QA_Pairs)
            axios.post(API.BASE_URL + 'pdfdata/', {
                database_id: selectedValue
            })
            .then(function (response) {
                console.log("PDF Label", response);
                const filteredLabels = response.data.pdffilename.filter(label => label !== null || "");
                setPdfLabel(filteredLabels);
                const filteredPdfLink = response.data.pdfdownload.filter(label => label !== null || "");
                setPdfLink(filteredPdfLink);
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

    const handleShowData = (id) => {
        setLoading(true);
        setPrimaryInput('');
        setResponseFrom('');
        setNewText('')
        setUrlData('')
        setMessage('')
        console.log("ID", id)
        setSingleLabelId(id)
        axios.post(API.BASE_URL + 'ShowData/', {
            id: id,
            database_id: selectedValue
        })
        .then(function (response) {
            setPrimaryInput('');
            setResponseFrom('');
            setNewText('')
            setMessage('')
            console.log("PDF response Data", response.data);
            setPdfData(response.data)
            if(response.data.message) {
                toast.warn("No data found")
            }
        })
        .catch(function (error) {
            console.log(error)
        })
        .finally(() => setLoading(false))
    }

    const handleLabelDelete = () => {
        setLoading(true);
        setContentVisible(false);
        axios.post(API.BASE_URL + 'deletelabel/', {
            database_id: selectedValue,
            label_id: labelDelId,
        })
        .then(function (response) {
            console.log("Delete Label", response);
            toast.success("Label Deleted");
            axios.post(API.BASE_URL + 'label/', {
                database_id: selectedValue
            })
            .then(function (response) {
                console.log("Questions", response);
                setQuestion(response.data.unique_label);
                setQuestionId(response.data.unique_id)
            })
            .catch(function (error) {
                console.log(error);
            })
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(() => setLoading(false));
    }

    const handleShowPopup = (e, id) => {
        console.log("ID", id)
        setLabelDelId(id)
        e.preventDefault()
        setContentVisible(true)
      }

    const handleClosePopup = (e) => {
        e.preventDefault()
        setContentVisible(false);
    };

    console.log("URLHOSTORY", urlHistory)
    console.log('Questions Data', questions)
    console.log("pdfLink", pdfLink?.length)
    console.log("pdfData", pdfLabel?.length)
    

  return (
    <div className="copy d-flex h-100 flex-column justify-content-between" id="left-tabs-example">
    {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}

        <div className='intro'>
            <p className='text-white user'>Welcome, <strong>{user? user : 'User'}</strong></p>
            <div className="buttons d-flex">
            <button className={selectedValue === 1 ? 'selected' : ''} onClick={() => handleButtonClick(1)}>Database 1</button>
            <button className={selectedValue === 2 ? 'selected' : ''} onClick={() => handleButtonClick(2)}>Database 2</button>
            </div>
        </div>
        {checkAdmin != 'true' ? (
            questions?.length > 0 ? (
                <ul className='p-4'>
                    {questions?.map((text) => {
                        return(
                            <li 
                            className='text-white d-flex align-items-center mb-4' 
                            style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}
                            
                            >
                                <FontAwesomeIcon 
                                    icon={faMessage}
                                    style={{
                                        color: "#fff",
                                        width: "15px",
                                        height: "15px",
                                        marginRight: 10
                                    }}
                                /> 
                                {text}
                            </li>
                        )
                    })}
                </ul>
            ) : (<p className='mb-0 d-flex h-100 justify-content-center align-items-center fs-6' style={{color: '#6c6c72'}}>No Search History</p>)
        ) : (
            <>
            <MDBTabs className='mb-3'>
                <MDBTabsItem>
                <MDBTabsLink onClick={() => handleBasicClick('tab1')} active={basicActive === 'tab1'}>
                    Upload
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
                    
                        {questions?.length > 0 ? (
                            <ul className='py-4 px-0'>
                                {questions?.map((text, i) => {
                                    const liClass = questionId[i] === activeId && pdfData?.length > 0? 'active' : '';
                                    
                                    return(
                                        text != '' && (
                                            <>
                                            <li
                                                className={`text-white d-flex align-items-center ${liClass}`}
                                                style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative', zIndex: 2,}}
                                                onClick={() => {setActiveId(questionId[i]);handleShowData(questionId[i])}}
                                                > <FontAwesomeIcon 
                                                icon={faMessage}
                                                style={{
                                                    color: "#fff",
                                                    width: "15px",
                                                    height: "15px",
                                                    marginRight: 10
                                                }}
                                            />
                                            {text}
                                                <FontAwesomeIcon 
                                                    icon={faShare}
                                                    style={{
                                                        color: "#fff",
                                                        width: "20px",
                                                        height: "20px",
                                                        marginLeft: 'auto',
                                                        marginRight: 30,
                                                    }}
                                                /> 
                                                <button className='delete-icon' onClick={(e) => {handleShowPopup(e, questionId[i])}}
                                                style={{
                                                    position: 'relative',
                                                    zIndex: 4,
                                                    right: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                }}>
                                                    <FontAwesomeIcon 
                                                        icon={faTrash}
                                                        style={{
                                                            color: "#fff",
                                                            width: "20px",
                                                            height: "20px",
                                                        }}
                                                    />
                                                </button>
                                                {
                                                isContentVisible && (
                                                  <div className="popup">
                                                    <div className="popup-content">
                                                        <h2> Do you want to delete label?</h2>
                                                        <p>Deleting will remove the label from database</p>
                                                        <div className="buttons">
                                                            <button className="btn" onClick={() => {handleLabelDelete()}}>Delete</button>
                                                            <button className="btn" onClick={(e) => handleClosePopup(e)}>Cancel</button>
                                                        </div>
                                                        <button className="close" onClick={(e) => handleClosePopup(e)}>
                                                            <FontAwesomeIcon
                                                            icon={faClose}
                                                            style={{ color: '#000', width: '25px', height: '25px' }}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                                )
                                              }
                                            </li>
                                            
                                              </>
                                        )
                                    )
                                })}
                            </ul>
                        ) :
                        selectedValue == null ? (
                        <h5
                        className='d-flex justify-content-center align-items-center text-white'
                        style={{
                            minHeight: '70vh',
                            margin: 0,
                        }}
                        >Select a database</h5>)
                    :
                    <h5
                        className='d-flex justify-content-center align-items-center text-white'
                        style={{
                            minHeight: '70vh',
                            margin: 0,
                        }}
                        >No Label Found</h5>
                        }
                    
                    </>
                </MDBTabsPane>

                <MDBTabsPane show={basicActive === 'tab3'}>
                    <ul className="p-0">
                        {pdfLabel?.message == "Data Not Found" || pdfLink?.length > 0 ? (
                            pdfLabel?.map((history, i) => {
                                return (
                                <a href={pdfLink[i]} download={pdfLink[i]} target="_blank" style={{textDecoration: 'none'}}>
                                    <li className='text-white d-flex align-items-center' style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                    <FontAwesomeIcon 
                                        icon={faMessage}
                                        style={{
                                        color: "#fff",
                                        width: "15px",
                                        height: "15px",
                                        marginRight: 10
                                        }}
                                    />
                                    {history}
                                    <FontAwesomeIcon 
                                            icon={faDownload}
                                            style={{
                                                color: "#fff",
                                                width: "20px",
                                                height: "20px",
                                                marginLeft: 'auto'
                                            }}
                                        /> 
                                    </li>
                                </a>
                                )
                            })
                        )
                        :
                        <h5
                        className='d-flex justify-content-center align-items-center text-white'
                        style={{
                            minHeight: '70vh',
                            margin: 0,
                        }}
                        >No Pdf Found</h5>
                    }
                    </ul>
                </MDBTabsPane>

                <MDBTabsPane show={basicActive === 'tab4'}>
                    <ul className="p-0">
                        {urlHistory?.length > 0 ? (
                        urlHistory?.map((history, i) => {
                            return(
                                <a className='url-share' href={history.url} target="_blank" rel="noopener noreferrer">
                                    <li className='text-white d-block align-items-center' style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: 325}}> <FontAwesomeIcon 
                                            icon={faMessage}
                                            style={{
                                                color: "#fff",
                                                width: "15px",
                                                height: "15px",
                                                marginRight: 10
                                            }}
                                            />
                                            {history.url}
                                        
                                    </li>
                                    <FontAwesomeIcon 
                                        icon={faShareFromSquare}
                                        className='share'
                                        style={{
                                            color: "#fff",
                                            width: "20px",
                                            height: "20px",
                                        }}
                                    /> 
                                </a>
                            )
                        }))
                        :
                        <h5
                        className='d-flex justify-content-center align-items-center text-white'
                        style={{
                            minHeight: '70vh',
                            margin: 0,
                        }}
                        >No URL Found</h5>
                    }
                    </ul>
                </MDBTabsPane>
            </MDBTabsContent>
            </>
        )}

            <div className="train-content">
              <button className='save mb-3' onClick={() => handleTrainData(true)}>Train Model</button>
            </div>
        <div className="logout mt-auto">
            <button type='button' className='button' onClick={() => {handleLogout()}}>Logout</button>
        </div>
    </div>
  )
}

export default Copy