import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { authContext } from '../context/authContext';
import { useLocation } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();
    const auth = React.useContext(authContext);
    const location = useLocation();
    const userEmail = location.state?.email;
    const [fail, setFail] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/v1/auth/login', {
                password: password,
                email: email,
            });
            const user = {
                email: response?.data?.data?.email,
                token: response?.data?.data?.token,
                id: response?.data?.data?.id,
            };
            auth.loginUser(user);
            if (response?.data?.data?.is_password_changed) {
                navigate('/enter-otp', {
                    state: { email: response?.data?.data?.email, token: response?.data?.data?.token },
                });
            } else if (response?.data?.data !== null) {
                navigate('/change-password', {
                    state: { token: response?.data?.data?.token, email: response?.data?.data?.email },
                });
            } else if (response?.data?.message === 'Invalid credentials') {
                setOpen(true);
                setTimeout(() => {
                    setOpen(false);
                }, 3000);
            }
        } catch (err) {
            console.log(err, 'Error');
        }
    };
    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        validateForm(inputEmail, password);
    };

    const handlePasswordChange = (e) => {
        const inputPassword = e.target.value;
        setPassword(inputPassword);
        validateForm(email, inputPassword);
    };

    const validateForm = (inputEmail, inputPassword) => {
        const isValidEmail = inputEmail.trim() !== '' && validateEmail(inputEmail);
        const isValidPassword = inputPassword.trim() !== '';
        setIsFormValid(isValidEmail && isValidPassword);
    };

    const validateEmail = (inputEmail) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(inputEmail);
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
                    setOpen1(true);
                    setTimeout(() => {
                        setOpen1(false);
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
    React.useEffect(() => {
        if (userEmail) {
            setEmail(userEmail);
        }
    }, [userEmail]);
    return (
        <>
            <div className='common-container'>
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
                {open ? (
                    <Alert
                        action={
                            <IconButton
                                aria-label='close'
                                color='inherit'
                                size='small'
                                onClick={() => {
                                    setOpen(false);
                                }}>
                                <CloseIcon fontSize='inherit' />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        style={{ position: 'absolute', marginTop: '10px', width: '100%', top: '2px' }}
                        severity='error'>
                        Invalid email or password
                    </Alert>
                ) : (
                    ''
                )}
                {open1 ? (
                    <Alert
                        action={
                            <IconButton
                                aria-label='close'
                                color='inherit'
                                size='small'
                                onClick={() => {
                                    setOpen(false);
                                }}>
                                <CloseIcon fontSize='inherit' />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        style={{ position: 'absolute', marginTop: '10px', width: '100%', top: '2px' }}>
                        You are successfully logged in
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
                    Login to the SKORBOARD platform{' '}
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
                        onChange={handleEmailChange}
                        placeholder='john@gmail.com'
                    />
                    <p className='labels'>Password</p>
                    <TextField
                        id='password'
                        value={password}
                        type='password'
                        variant='outlined'
                        fullWidth
                        style={{ margin: '10px 0px' }}
                        autoComplete='off'
                        onChange={handlePasswordChange}
                        placeholder='********'
                    />
                    <p style={{ margin: '0px', textAlign: 'right', fontSize: '14px' }}>
                        Do not have an account? <a href='/user-register'>Signup</a>
                    </p>
                    <Button
                        type='submit'
                        disabled={!isFormValid}
                        onClick={handleSubmit}
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
                        <GoogleIcon style={{ margin: '0px 10px 5px 10px' }} /> Sign in with Google
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

export default Login;
