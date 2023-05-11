import React, {useState} from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../../config/Api';
import { toast } from 'react-toastify';

import Google from '../../assets/google.svg';
import Outlook from '../../assets/outlook.svg';

function Signup() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = () => {
        axios.post(API.BASE_URL + 'register/', {
            email: email,
            firstname: firstName,
            lastname: lastName,
            password: password,
        })
        .then(function (response) {
            console.log("SIGNUP", response)
            toast.success("Sign up successfully");
            navigate('/')
        })
        .catch(function (error) {
            console.log(error);
            if(error.response.data.firstname) {
                toast.warn("Please provide First Name");
            }
            else if(error.response.data.lastname) {
                toast.warn("Please provide Last Name");
            }
            else if(error.response.data.password) {
                toast.warn("Please provide Password");
            }
            else if(error.response.data.email == "please provide a email") {
                toast.warn("Please provide an Email");
            }
            else if(error.response.data.email == "Enter a valid email address.") {
                toast.warn("Enter a valid email address");
            }
            else if(error.response.data.email == "user with this email address already exists.") {
                toast.warn("User with this email address already exists.");
            }
            else {
                toast.warn("An error occurred, please try again later")
            }
        })
    }
  return (
    <div className='signup auth'>
        <Container>
            <div className="auth-container">
                <h3 className='mb-4'>Sign Up</h3>
                <form className='d-flex flex-wrap justify-content-between'>
                <div className="input-container">
                    <label htmlFor="">First Name</label>
                    <input type="text" placeholder='Enter your First Name' value={firstName} onChange={(e) => {setFirstName(e.target.value)}} />
                </div>
                <div className="input-container">
                    <label htmlFor="">Last Name</label>
                    <input type="text" placeholder='Enter your Last Name' value={lastName} onChange={(e) => {setLastName(e.target.value)}} />
                </div>
                <div className="input-container">
                    <label htmlFor="">Email</label>
                    <input type="email" placeholder='Enter your email' value={email} onChange={(e) => {setEmail(e.target.value)}} />
                </div>
                <div className="input-container">
                    <label htmlFor="">Password</label>
                    <input type="password"  placeholder='Enter your password' value={password} onChange={(e) => {setPassword(e.target.value)}} />
                </div>
                <div className="input-buttons d-flex flex-column align-items-center mt-2 w-100">
                    <button type='button' className='button button-fill mb-2' onClick={(e) => {handleSignup(e)}}>Sign Up</button>
                    <span className='mx-md-4'>or</span>
                    <Link to='/'>Sign In</Link>
                </div>
                {/* <span className='mt-4 line'></span>
                <div className="buttons w-100 mt-4">
                    <button className='button'><img src={Google} alt='google' /> Sign in with Google</button>
                    <button className='button'><img src={Outlook} alt='outlook' /> Sign in with Outlook</button>
                </div> */}
                </form>
            </div>
            <footer><p className='text-white text-center mt-4'>© 2022-2023 License, Chatbot. All rights reserved</p></footer>
        </Container>
    </div>
  )
}

export default Signup