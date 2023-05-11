import React, {useState, useContext} from 'react';
import axios from 'axios';
import { API } from '../../config/Api';
import UserContext from '../context/UserContext';

function Copy() {
    const [primaryInput, setPrimaryInput] = useState('');
    const [loading, setLoading] = useState(false);
    const {setText, token} = useContext(UserContext)

    const getContent = (e) => {
        setLoading(true);
        e.preventDefault();
        axios.post(API.BASE_URL + 'generate/', {
            user_id: 1,
            input: primaryInput
        }, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`
        }})
        .then(function (response) {
            console.log("Data", response);
            setText(response.data.output)
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(() => setLoading(false));
    }
  return (
    <div className="copy" id="left-tabs-example">
        {loading && <div className='loader'><span></span></div>}
        <form action="">
            <div className="input-container w-100">
                <label htmlFor="">Primary Keyword</label>
                <input type="text" placeholder='AI writing assistant' value={primaryInput} onChange={(e) => {setPrimaryInput(e.target.value)}} />
            </div>
            <div className="input-container w-100">
                <label htmlFor="">Upload a File</label>
                <input type="file" accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
            </div>
            <div className="input-container">
                <label htmlFor="">Enter a URL</label>
                <input type='url' placeholder='URL for Scraping Data' />
            </div>
            <button type='button' className='button button-fill' onClick={(e) => {getContent(e)}}>Start Writing</button>
        </form>
    </div>
  )
}

export default Copy