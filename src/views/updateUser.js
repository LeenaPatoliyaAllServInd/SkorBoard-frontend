import React from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { authContext } from '../context/authContext';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function UpdateUser(props) {
    const auth = React.useContext(authContext);
    const [firstName, setFirstName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [billingAd, setBillingAd] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [stateName, setStateName] = React.useState('');
    const [city, setCity] = React.useState('');
    const [zip, setZip] = React.useState('');
    const [success, setSuccess] = React.useState(false);
    const [fail, setFail] = React.useState(false);

    const getUser = async () => {
        try {
            console.log(auth?.user);
            const user = await axios.get(`http://localhost:3000/v1/auth/user/profile/${auth?.user?.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    token: auth?.user?.token,
                },
            });
            console.log(user, '>>>response');
            const res = user?.data?.data;
            setEmail(res?.email);
            setFirstName(res?.first_name);
            setLastName(res?.last_name);
            setBillingAd(res?.billing_address);
            setCountry(res?.country);
            setStateName(res?.state);
            setCity(res?.city);
            setZip(res?.zip);
        } catch (err) {
            console.log(err, 'Error');
        }
    };
    React.useEffect(() => {
        getUser();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:3000/v1/auth/update-profile',
                {
                    id: auth?.user?.id,
                    first_name: firstName,
                    last_name: lastName,
                    billing_address: billingAd,
                    country: country,
                    state: stateName,
                    city: city,
                    zip: Number(zip),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        token: auth?.user?.token,
                    },
                },
            );
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 3000);

            clearAll();
        } catch (err) {
            setFail(true);
            setTimeout(() => {
                setFail(false);
            }, 3000);
        }
    };
    const clearAll = () => {
        setFirstName('');
        setLastName('');
        setCity('');
        setBillingAd('');
        setCountry('');
        setStateName('');
        setZip('');
        getUser();
    };
    const handleZipChange = (e) => {
        const inputZip = e.target.value;
        const regex = /^[0-9\b]+$/;

        if (inputZip === '' || regex.test(inputZip)) {
            setZip(inputZip);
        }
    };

    return (
        <>
            <div className='common-container'>
                {success || fail ? (
                    <Alert
                        action={
                            <IconButton
                                aria-label='close'
                                color='inherit'
                                size='small'
                                onClick={() => {
                                    setSuccess(false);
                                }}>
                                <CloseIcon fontSize='inherit' />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        style={{ position: 'absolute', width: '100%', top: '2px' }}
                        severity={success ? 'success' : 'error'}>
                        {success ? 'User updated successfully' : 'User not updated'}
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
                    Update details
                </h3>
                <form autoComplete='off' style={{ width: '100%' }}>
                    <p className='labels'>First Name</p>
                    <TextField
                        id='fname'
                        value={firstName}
                        type='text'
                        variant='outlined'
                        fullWidth
                        style={{ margin: '10px 0px' }}
                        autoComplete='off'
                        onChange={(e) => {
                            setFirstName(e.target.value);
                        }}
                    />
                    <p className='labels'>Last Name</p>
                    <TextField
                        id='lname'
                        value={lastName}
                        type='text'
                        variant='outlined'
                        fullWidth
                        style={{ margin: '10px 0px' }}
                        autoComplete='off'
                        onChange={(e) => {
                            setLastName(e.target.value);
                        }}
                    />
                    <p className='labels'>Email</p>
                    <TextField
                        id='email'
                        value={email}
                        type='email'
                        variant='outlined'
                        fullWidth
                        style={{ margin: '10px 0px' }}
                        autoComplete='off'
                        aria-readonly
                    />
                    <p className='labels'>Billing Address</p>
                    <TextField
                        id='billing'
                        value={billingAd}
                        type='text'
                        variant='outlined'
                        fullWidth
                        style={{ margin: '10px 0px' }}
                        autoComplete='off'
                        onChange={(e) => {
                            setBillingAd(e.target.value);
                        }}
                    />
                    <p className='labels'>Country</p>
                    <TextField
                        id='country'
                        value={country}
                        type='text'
                        variant='outlined'
                        fullWidth
                        style={{ margin: '10px 0px' }}
                        autoComplete='off'
                        onChange={(e) => {
                            setCountry(e.target.value);
                        }}
                    />

                    <p className='labels'>State</p>
                    <TextField
                        id='state'
                        value={stateName}
                        type='text'
                        variant='outlined'
                        fullWidth
                        style={{ margin: '10px 0px' }}
                        autoComplete='off'
                        onChange={(e) => {
                            setStateName(e.target.value);
                        }}
                    />
                    <p className='labels'>City</p>
                    <TextField
                        id='city'
                        value={city}
                        type='text'
                        variant='outlined'
                        fullWidth
                        style={{ margin: '10px 0px' }}
                        autoComplete='off'
                        onChange={(e) => {
                            setCity(e.target.value);
                        }}
                    />
                    <p className='labels'>Zip</p>
                    <TextField
                        id='zip'
                        value={zip}
                        type='text'
                        variant='outlined'
                        fullWidth
                        style={{ margin: '10px 0px' }}
                        autoComplete='off'
                        onChange={handleZipChange}
                    />
                    <Button
                        type='submit'
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

export default UpdateUser;
