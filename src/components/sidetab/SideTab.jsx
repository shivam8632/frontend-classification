import React, {useState, useContext} from 'react';
import UserContext from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from "@fortawesome/free-solid-svg-icons";

function Copy() {
    const {label} = useContext(UserContext)

    console.log("label", label)
  return (
    <div className="copy d-flex h-100 flex-column justify-content-between" id="left-tabs-example">
        <p className='text-white user'>Welcome, <strong>User</strong></p>
        {label?.length > 0 ? (
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
        ) : (<p className='mb-0 d-flex h-100 justify-content-center align-items-center fs-6' style={{color: '#6c6c72'}}>No Search History</p>)}
        <div className="logout mt-auto">
            <button type='button' className='button'>Logout</button>
        </div>
    </div>
  )
}

export default Copy