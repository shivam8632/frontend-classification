import React, {useState, useContext} from 'react';
import UserContext from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { API } from '../../config/Api';

function Copy() {
    const {label, setText} = useContext(UserContext)
    const [URL, setUrl] = useState('')
    console.log("label", label)
    const user =  localStorage.getItem("User_name")
    const checkAdmin = localStorage.getItem("Check_is_admin")
    console.log("checkAdmin", checkAdmin)

    const handleScrapping = () => {
        axios.post(API.BASE_URL + 'adminscrapping/', {
            url: URL,
        })
        .then(function (response) {
            console.log("Scrapping", response);
            setText(response.data.data)
        })
        .catch(function (error) {
            console.log(error);
        })
    }
  return (
    <div className="copy d-flex h-100 flex-column justify-content-between" id="left-tabs-example">
        <p className='text-white user'>Welcome, <strong>{user? user : 'User'}</strong></p>
        {checkAdmin != 'true' ? (
            label?.length > 0 ? (
                <ul className='p-4'>
                    {label?.map((text) => {
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
                    <input className='w-100' type="url" placeholder='Enter a URL' onChange={(e) => {setUrl(e.target.value)}} />
                </div>
                <button type='button' className='scrap' onClick={() => handleScrapping()}>Enter</button>
                <div className="input-container mt-4">
                    <label className='text-white mb-3'>Upload Video</label>
                    <input className='w-100 text-white' type="file" accept="image/*, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                <button type='button' className='scrap' onClick={() => handleScrapping()}>Upload Video</button>
                </div>
            </div>
        )}
        <div className="logout mt-auto">
            <button type='button' className='button'>Logout</button>
        </div>
    </div>
  )
}

export default Copy