import React from 'react';
import { Button } from '@mui/material';
import { Input as BaseInput } from '@mui/base/Input';
import PropTypes from 'prop-types';
import { Box, styled } from '@mui/system';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

function OTP({ separator, length, value, onChange }) {
    const inputRefs = React.useRef(new Array(length).fill(null));

    const focusInput = (targetIndex) => {
        const targetInput = inputRefs.current[targetIndex];
        targetInput.focus();
    };

    const selectInput = (targetIndex) => {
        const targetInput = inputRefs.current[targetIndex];
        targetInput.select();
    };

    const handleKeyDown = (event, currentIndex) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case ' ':
                event.preventDefault();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (currentIndex < length - 1) {
                    focusInput(currentIndex + 1);
                    selectInput(currentIndex + 1);
                }
                break;
            case 'Delete':
                event.preventDefault();
                onChange((prevOtp) => {
                    const otp = prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
                    return otp;
                });

                break;
            case 'Backspace':
                event.preventDefault();
                if (currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }

                onChange((prevOtp) => {
                    const otp = prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
                    return otp;
                });
                break;

            default:
                break;
        }
    };

    const handleChange = (event, currentIndex) => {
        const currentValue = event.target.value;
        const numericValue = currentValue.replace(/\D/g, ''); // Remove non-numeric characters

        if (numericValue.length > 0) {
            // Update the OTP value only if it's a valid numeric value
            onChange((prev) => {
                const otpArray = prev.split('');
                const lastValue = numericValue.charAt(0); // Use the first character of numericValue
                otpArray[currentIndex] = lastValue;
                return otpArray.join('');
            });

            if (currentIndex < length - 1) {
                focusInput(currentIndex + 1);
            }
        } else {
            // Handle the case when the input is empty or contains non-numeric characters
            // Keep the cursor in the current input box
            focusInput(currentIndex);
        }
    };

    const handleClick = (event, currentIndex) => {
        selectInput(currentIndex);
    };

    const handlePaste = (event, currentIndex) => {
        event.preventDefault();
        const clipboardData = event.clipboardData;

        // Check if there is text data in the clipboard
        if (clipboardData.types.includes('text/plain')) {
            let pastedText = clipboardData.getData('text/plain');
            pastedText = pastedText.substring(0, length).trim();
            let indexToEnter = 0;

            while (indexToEnter <= currentIndex) {
                if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
                    indexToEnter += 1;
                } else {
                    break;
                }
            }
            const otpArray = value.split('');

            for (let i = indexToEnter; i < length; i += 1) {
                const lastValue = pastedText[i - indexToEnter] ?? ' ';
                otpArray[i] = lastValue;
            }

            onChange(otpArray.join(''));
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
            {new Array(length).fill(null).map((_, index) => (
                <React.Fragment key={index}>
                    <BaseInput
                        slots={{
                            input: InputElement,
                        }}
                        aria-label={`Digit ${index + 1} of OTP`}
                        slotProps={{
                            input: {
                                ref: (ele) => {
                                    inputRefs.current[index] = ele;
                                },
                                onKeyDown: (event) => handleKeyDown(event, index),
                                onChange: (event) => handleChange(event, index),
                                onClick: (event) => handleClick(event, index),
                                onPaste: (event) => handlePaste(event, index),
                                value: value[index] ?? '',
                            },
                        }}
                    />
                    {index === length - 1 ? null : separator}
                </React.Fragment>
            ))}
        </Box>
    );
}

OTP.propTypes = {
    length: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    separator: PropTypes.node,
    value: PropTypes.string.isRequired,
};

function Otp() {
    const [otp, setOtp] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [disable, setDisable] = React.useState(true);
    const location = useLocation();
    const email = location.state?.email;
    const token = location.state?.token;
    const navigate = useNavigate();

    React.useEffect(() => {
        otp === '' || otp.length < 4 ? setDisable(true) : setDisable(false);
    }, [otp]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:3000/v1/auth/verify/otp',
                {
                    email: email,
                    otp: otp,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        token: token,
                    },
                },
            );
            if (response?.data?.message === 'OTP verify successfully') {
                navigate('/');
            } else {
                setOpen(true);
                setOtp('');
                setTimeout(() => {
                    setOpen(false);
                }, 3000);
            }
        } catch (err) {
            console.log(err, 'Error');
        }
    };
    return (
        <>
            <div className='common-container'>
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
                        style={{ position: 'absolute', width: '100%', top: '2px' }}
                        severity='error'>
                        Invalid otp
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
                <h3 align='left' style={{ margin: '15px 0px 1.5rem 0px', fontWeight: '600' }}>
                    Enter OTP
                </h3>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 2,
                    }}>
                    <OTP separator={<span> </span>} value={otp} onChange={setOtp} length={4} />
                </Box>
                <Button
                    type='submit'
                    disabled={disable}
                    onClick={handleSubmit}
                    variant='contained'
                    style={{ margin: '10px 0px' }}
                    fullWidth>
                    Submit
                </Button>
            </div>
        </>
    );
}
const blue = {
    100: '#DAECFF',
    200: '#80BFFF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
};
const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};
const InputElement = styled('input')(
    ({ theme }) => `
    width: 40px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 0px;
    border-radius: 8px;
    text-align: center;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
        };
    &:hover {
      border-color: ${blue[400]};
    }
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
);

export default Otp;
