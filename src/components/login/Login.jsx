import React, {useState, useContext} from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../config/Api';
import UserContext from '../context/UserContext';
import axios from 'axios';

import Google from '../../assets/google.svg';
import Outlook from '../../assets/outlook.svg';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {setToken} = useContext(UserContext)

    const navigate = useNavigate();

    const handleLogin = () => {
        axios.post(API.BASE_URL + 'login/', {
            email: email,
            password: password,
        })
        .then(function (response) {
            console.log("LOGIN", response)
            toast.success("Logged in Successfully!");
            localStorage.setItem("Token",response.data.token.access)
            setToken(localStorage.getItem("Token"))
            navigate('/dashboard')
        })
        .catch(function (error) {
            console.log(error);
            if(error.response.data.message) {
                toast.warn(error.response.data.message)
            }
        })
    }
  return (
    <div className='login auth'>
        <Container>
            <div className="auth-container">
            <h3 className='mb-4'>Sign In</h3>
            <form>
                <div className="input-container">
                    <label htmlFor="">Email</label>
                    <input type="email" placeholder='Enter your email' value={email} onChange={(e) => {setEmail(e.target.value)}} />
                </div>
                <div className="input-container">
                    <label htmlFor="">Password</label>
                    <input type="password"  placeholder='Enter your password' value={password} onChange={(e) => {setPassword(e.target.value)}} />
                </div>
                <div className="input-buttons d-flex flex-column align-items-center mt-2">
                    <button type='button' onClick={(e) => {handleLogin(e)}} className='button button-fill mb-2'>Sign In</button>
                    <span className='mx-md-4'>or</span>
                    <Link to='/signup'>Sign up</Link>
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

export default Login