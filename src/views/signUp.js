import React, { useState, useContext } from 'react';
import { TextField, Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../context/authContext';

function Signup() {
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const [fail, setFail] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const navigate = useNavigate();
    const auth = useContext(authContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/v1/auth/register', {
                email: email,
            });
            console.log('Response:', response.data);
            if (response?.data?.message === 'User created successfully') {
                setOpen(true);
                setTimeout(() => {
                    navigate('/user-login', { state: { email: email } });
                    setOpen(false);
                }, 3000);
            }
        } catch (error) {
            setFail(true);
            setTimeout(() => {
                setFail(false);
            }, 3000);
            console.error('Axios Error:', error.message);
            console.error('Request Config:', error.config);
            console.error('Network Error:', error.response?.data || error.request || error.message);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                console.log(tokenResponse);
                const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const response = await axios.post('http://localhost:3000/v1/auth/google-signin', {
                    email: userInfo?.data?.email,
                    first_name: userInfo?.data?.given_name,
                    last_name: userInfo?.data?.family_name,
                });
                if (response?.data?.message === 'User created successfully') {
                    const user = {
                        email: response?.data?.data?.email,
                        token: response?.data?.data?.token,
                        id: response?.data?.data?.id,
                    };
                    auth.loginUser(user);
                    navigate('/');
                    setOpen(true);
                    setTimeout(() => {
                        setOpen(false);
                    }, 3000);
                }
            } catch (err) {
                console.log(err, 'Error');
                setFail(true);
                setTimeout(() => {
                    setFail(false);
                }, 3000);
            }
        },
        onError: (errorResponse) => console.log(errorResponse),
    });
    const handleInputChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        // Validate email format
        setEmailValid(validateEmail(inputEmail));
    };
    const validateEmail = (inputEmail) => {
        // Simple email format validation using regex
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(inputEmail);
    };
    return (
        <>
            <div className='singup-con common-container'>
                {open ? (
                    <Alert
                        action={
                            <IconButton
                                aria-label='close'
                                color='inherit'
                                size='small'
                                onClick={() => {
                                    setOpen(false);
                                    navigate('/user-login', { state: { email: email } });
                                }}>
                                <CloseIcon fontSize='inherit' />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        style={{ position: 'absolute', marginTop: '10px', width: '100%', top: '2px' }}
                        severity='success'>
                        {`Password has been sent to ${email}`}
                    </Alert>
                ) : (
                    ''
                )}
                {fail ? (
                    <Alert
                        action={
                            <IconButton
                                aria-label='close'
                                color='inherit'
                                size='small'
                                onClick={() => {
                                    setFail(false);
                                }}>
                                <CloseIcon fontSize='inherit' />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        style={{ position: 'absolute', marginTop: '10px', width: '100%', top: '2px' }}
                        severity='warning'>
                        This email already exists
                    </Alert>
                ) : (
                    ''
                )}
                <img
                    src={require('../assets/images/logo_skorboard.png')}
                    alt='logo'
                    style={{ width: '100%' }}></img>
                <h1 align='left' style={{ margin: '0px 0px 15px 0px', fontSize: '30px' }}>
                    👋Hello!
                </h1>
                <h3 align='left' style={{ margin: '5px 0px 1.5rem 0px', fontWeight: '600' }}>
                    Signup to the SKORBOARD platform
                </h3>
                <form autoComplete='off'>
                    <p className='labels'>Email</p>
                    <TextField
                        id='email'
                        value={email}
                        type='email'
                        variant='outlined'
                        fullWidth
                        style={{ margin: '10px 0px' }}
                        autoComplete='off'
                        onChange={handleInputChange}
                        placeholder='john@gmail.com'
                    />
                    <p style={{ margin: '0px', textAlign: 'right', fontSize: '14px' }}>
                        Already registered ?<a href='/user-login'> Login</a>
                    </p>
                    <Button
                        type='submit'
                        onClick={handleSubmit}
                        disabled={!emailValid || email === ''}
                        variant='contained'
                        style={{ margin: '10px 0px' }}
                        fullWidth>
                        Submit
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            googleLogin();
                        }}
                        variant='outlined'
                        color='primary'
                        style={{ margin: '10px 0px', textTransform: 'capitalize' }}
                        fullWidth>
                        <GoogleIcon style={{ margin: '0px 10px 5px 10px', textTransform: 'capitalize' }} /> sign
                        in with google
                    </Button>
                    <Button
                        variant='outlined'
                        color='primary'
                        style={{ margin: '10px 0px', textTransform: 'capitalize' }}
                        fullWidth>
                        <AppleIcon style={{ margin: '0px 10px 5px 10px' }} /> sign in with Apple
                    </Button>
                </form>
            </div>
        </>
    );
}

export default Signup;
