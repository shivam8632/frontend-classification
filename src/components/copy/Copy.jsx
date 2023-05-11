import React, {useState, useContext} from 'react';
import axios from 'axios';
import { API } from '../../config/Api';
import UserContext from '../context/UserContext';

function Copy() {
    const [variants, setVariants] = useState('');
    const [language, setLanguage] = useState('');
    const [primaryInput, setPrimaryInput] = useState('');
    const [loading, setLoading] = useState(false);
    const {setText, token} = useContext(UserContext)

    const getContent = (e) => {
        setLoading(true);
        e.preventDefault();
        axios.post(API.BASE_URL + 'generate/', {
            language: language,
            user_id: 1,
            variant: variants,
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

    console.log("Variant", variants);
    console.log("Language", language)
  return (
    <div className="copy">
        {loading && <div className='loader'><span></span></div>}
        <form action="">
            <div className="input-container w-100">
                <label htmlFor="">Select a Language</label>
                <select value={language} onChange={(e) => {setLanguage(e.target.value)}}>
                    <option value="">Choose a Language</option>
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                </select>
            </div>
            {/* <div className="input-container">
                <label htmlFor="">Select Tone</label>
                <select name="" id="">
                    <option value="">Convincing</option>
                    <option value="">Appreciative</option>
                    <option value="">Assertive</option>
                    <option value="">Awestruck</option>
                    <option value="">Candid</option>
                </select>
            </div>
            <div className="input-container">
                <label htmlFor="">Choose Usecase</label>
                <select name="" id="">
                    <option value="">Blog Idea & Outline</option>
                    <option value="">Blog Section Writing</option>
                    <option value="">Brand Name</option>
                    <option value="">Business Idea</option>
                    <option value="">Call to Action</option>
                </select>
            </div> */}
            <div className="input-container w-100">
                <label htmlFor="">Primary Keyword</label>
                <input type="text" placeholder='AI writing assistant' value={primaryInput} onChange={(e) => {setPrimaryInput(e.target.value)}} />
            </div>
            <div className="input-container">
                <label htmlFor="">Number of Variants</label>
                <select value={variants} onChange={(e) => {setVariants(e.target.value)}}>
                    <option value="">Choose a Variant</option>
                    <option value="1 variant">1 Variant</option>
                    <option value="2 variant">2 Variant</option>
                    <option value="3 variant">3 Variant</option>
                </select>
            </div>
            {/* <div className="input-container">
                <label htmlFor="">Creativity Level</label>
                <select name="" id="">
                    <option value="">Optimal</option>
                    <option value="">Low</option>
                    <option value="">Mediums</option>
                </select>
            </div> */}
            <button type='button' className='button button-fill' onClick={(e) => {getContent(e)}}>Start Writing</button>
        </form>
    </div>
  )
}

export default Copy