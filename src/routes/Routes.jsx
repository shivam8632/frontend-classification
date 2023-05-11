import { Routes, Route } from 'react-router-dom';
import Login from '../components/login/Login';
import Signup from '../components/signup/Signup';
import Dashboard from '../components/dashboard/Dashboard';

const Routing = () => {
  return (
      
    <div className="routes">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default Routing;