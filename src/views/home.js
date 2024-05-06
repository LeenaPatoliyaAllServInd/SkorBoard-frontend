import React from 'react'
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate()
    return (
        <div>
            <h1>Home Page !🏡</h1>
            <Button onClick={() => {
                navigate("/update-user")
            }}>Update user</Button>
        </div>
    )
}

export default Home