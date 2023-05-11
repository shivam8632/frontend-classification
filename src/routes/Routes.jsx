import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../components/login/Login';
import Signup from '../components/signup/Signup';
import Dashboard from '../components/dashboard/Dashboard';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const Routing = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const [isToastShown, setIsToastShown] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === '/dashboard' && !token && !isToastShown) {
      toast.warn('User not logged in!');
      setIsToastShown(true);
      navigate('/');
    }
  }, [pathname, token, isToastShown, navigate]);
  return (
      
    <div className="routes">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        {token && <Route path='/dashboard' element={<Dashboard />} />}
      </Routes>
    </div>
  );
}

export default Routing;