import { React } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';

import Login from './routes/Login/login.component';
import CodemegleHome from './routes/CodemegleHome/codemegle-home.component';

import './App.css';

function App() {
  return (
    <div className='Root'>
        <div className='App'>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element ={ <Login /> } />
                    <Route exact path="/home" element ={ <CodemegleHome /> } />
                </Routes>
            </BrowserRouter>
        </div>
    </div>
  );
}

export default App;
