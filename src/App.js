import React from 'react';
import './App.css';
import ChangePassword from './views/changePassword';
import Login from './views/login';
import Signup from './views/signUp';
import { Container } from '@mui/material'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Otp from './views/otp';
import Home from './views/home';
import Footer from './views/footer';
import UpdateUser from './views/updateUser';

function App() {
  return (
    <div className="App">
      <Container className='main-container'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user-login" element={<Login />} />
            <Route path="/user-register" element={<Signup />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/enter-otp" element={<Otp />} />
            <Route path="/update-user" element={<UpdateUser />} />
          </Routes>
        </BrowserRouter>
        {/* <Signup />
        <Login /> */}
        <Footer />
      </Container >
    </div >
  );
}

export default App;
