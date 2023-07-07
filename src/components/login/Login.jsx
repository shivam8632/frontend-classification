import React, {useState, useContext} from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../config/Api';
import UserContext from '../context/UserContext';
import axios from 'axios';
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading,setLoading]=useState(false)
    const {setToken} = useContext(UserContext);

    const navigate = useNavigate();

    const handleLogin = () => {
        setLoading(true)
        axios.post(API.BASE_URL + 'login/', {
            email: email,
            password: password,
        })
        .then(function (response) {
            console.log("LOGIN", response)
            toast.success("Logged in Successfully!");
            localStorage.setItem("Token",response.data.token.access)
            setToken(localStorage.getItem("Token"))
            axios.post(API.BASE_URL + 'userprofile/', {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("Token")}`
            }})
            .then(function (response) {
                console.log("UserProfile", response);
                localStorage.setItem("User_name", response.data.firstname)
                localStorage.setItem("Check_is_admin", response.data.is_admin)
                localStorage.setItem("User_ID", response.data.id)
                navigate('/dashboard')
            })
            .catch(function (error) {
                console.log(error);
            })
        })
        .catch(function (error) {
            console.log(error);
            if(error.message) {
                toast.warn(error.message)
            }
        })
        .finally(()=>setLoading(false))
    }
    
  return (
    <div className='login auth'>
        <Container>
        {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
            <div className="auth-container">
            <h3 className='mb-4 text-white'>Sign In</h3>
            <form onKeyDown={(e) => {
                if (e.key === "Enter") {
                handleLogin(e);
                }
            }}>
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
            </form>
            </div>
            <footer><p className='text-white text-center mt-4'>© 2022-2023 License, Chatbot. All rights reserved</p></footer>
        </Container>
    </div>
  )
}

export default Login