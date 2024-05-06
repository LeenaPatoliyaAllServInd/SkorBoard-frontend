import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import checkPassword from '../lib/password';
import { authContext } from '../context/authContext';

function ChangePassword() {
    const [password, setPassword] = useState('');
    const [consfPassword, setConfPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isWrongPass, setIsWrongPass] = useState(false);
    const location = useLocation();
    const token = location.state?.token;
    const navigate = useNavigate();
    const [isValidConfPass, setIsValidConfPass] = useState(true);
    const auth = React.useContext(authContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password === consfPassword) {
            try {
                const response = await axios.post(
                    'http://localhost:3000/v1/auth/change-password',
                    {
                        email: auth?.user?.email,
                        newPassword: password,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            token: token,
                        },
                    },
                );
                if (response?.data?.message === 'Password changed successfully') {
                    navigate('/user-login', { state: { email: auth?.user?.email } });
                    setOpen(true);
                    setConfPassword('');
                    setPassword('');
                    setTimeout(() => {
                        setOpen(false);
                    }, 3000);
                }
            } catch (err) {
                console.log(err, 'Error');
            }
        } else {
            setIsValidConfPass(false);
            console.log('Password and Confirm password should be same');
        }
    };

    const handlePasswordChange = (e) => {
        const inputPassword = e.target.value;
        setPassword(inputPassword);
        validateForm(inputPassword, consfPassword);
    };
    const handleConfPasswordChange = (e) => {
        const inputPasswordConf = e.target.value;
        setConfPassword(inputPasswordConf);
        validateForm(password, inputPasswordConf);
    };
    const validateForm = (inputPassword, inputPasswordConf) => {
        const isValidPassword = inputPassword.trim() !== '' && validatePassword(inputPassword);
        const isValidConfPass = inputPasswordConf.trim() !== '';
        setIsFormValid(isValidPassword && isValidConfPass);
    };
    const validatePassword = (inputPassword) => {
        const force = checkPassword(inputPassword);
        if (force < 50) {
            setIsWrongPass(true);
            return false;
        } else {
            setIsWrongPass(false);
            return true;
        }
    };

    return (
        <>
            <div className='common-container singup-con'>
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
                        style={{ position: 'absolute', marginTop: '10px', width: '100%', top: '2px' }}>
                        Password changed successfully
                    </Alert>
                ) : (
                    ''
                )}
                <img
                    src={require('../assets/images/logo_skorboard.png')}
                    alt='logo'
                    style={{ width: '100%' }}></img>
                <h1 align='center' style={{ margin: '0px 0px 15px 0px', fontSize: '30px' }}>
                    👋Hello!
                </h1>
                <h3 align='center' style={{ margin: '5px 0px 1.5rem 0px', fontWeight: '600' }}>
                    Change Password{' '}
                </h3>
                <form autoComplete='on' style={{ width: '100%' }}>
                    <p className='labels'>Password</p>
                    <TextField
                        id='password'
                        value={password}
                        type='password'
                        variant='outlined'
                        fullWidth
                        style={{ margin: '10px 0px', backgroundColor: '#fff' }}
                        autoComplete='off'
                        onChange={handlePasswordChange}
                    />
                    {isWrongPass ? (
                        <p style={{ color: '#e67c2b', fontSize: 'smaller', margin: '2px', textAlign: 'left' }}>
                            A minimum 8 characters password contains a combination of uppercase and lowercase
                            letter and number are required.
                        </p>
                    ) : (
                        ''
                    )}
                    <p className='labels'>Confirm Password</p>
                    <TextField
                        id='confPassword'
                        value={consfPassword}
                        type='password'
                        variant='outlined'
                        fullWidth
                        style={{ margin: '10px 0px' }}
                        autoComplete='off'
                        onChange={handleConfPasswordChange}
                    />
                    {!isValidConfPass ? (
                        <p style={{ color: 'red', fontSize: 'smaller', margin: '2px', textAlign: 'left' }}>
                            Password and Confirm password should be same
                        </p>
                    ) : (
                        ''
                    )}
                    <Button
                        type='submit'
                        disabled={!isFormValid}
                        onClick={handleSubmit}
                        variant='contained'
                        style={{ margin: '10px 0px' }}
                        fullWidth>
                        Submit
                    </Button>
                </form>
            </div>
        </>
    );
}
export default ChangePassword;
