import React, {useState, useContext, useEffect} from 'react';
import UserContext from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { API } from '../../config/Api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Copy() {
    const {label, setText, token, questions, setQuestion, text, message, setMessage} = useContext(UserContext)
    const [URL, setUrl] = useState('')
    const [loading, setLoading] = useState(false);
    const [fileCheck, setFileCheck] = useState('')
    console.log("label", label)
    console.log("FIle", fileCheck)

    const user =  localStorage.getItem("User_name");
    const checkAdmin = localStorage.getItem("Check_is_admin");
    const user_id = localStorage.getItem("User_ID");
    console.log("checkAdmin", checkAdmin);
    const navigate = useNavigate();
    // const formData = new FormData();
    // formData.append("pdf", fileCheck)
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
            console.log("Scrapping", response);
            setMessage('')
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
    
        axios.post(API.BASE_URL + 'pdfresult/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(function (response) {
            console.log('Data', response);
            setMessage(response.data.message)
            
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(() => setLoading(false));
      };
    

  return (
    <div className="copy d-flex h-100 flex-column justify-content-between" id="left-tabs-example">
        {loading && <div className='loader'><span></span></div>}
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
            <div className='input-list' style={{padding: 15}}>
                <div className="input-container">
                    <label className='text-white mb-3'>URL Scrapping</label>
                    <input className='w-100' type="url" placeholder='Enter a URL' onChange={(e) => {setUrl(e.target.value)}} onKeyDown={handleKeyPress} />
                </div>
                <button type='button' className='scrap' onClick={() => handleScrapping()}>Enter</button>
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
        )}
        <div className="logout mt-auto">
            <button type='button' className='button' onClick={() => {handleLogout()}}>Logout</button>
        </div>
    </div>
  )
}

export default Copy