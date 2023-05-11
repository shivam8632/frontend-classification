import './App.scss';
import Routing from './routes/Routes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div className="App">
      <Routing />
      <ToastContainer autoclose={3000} />
    </div>
  );
}

export default App;
