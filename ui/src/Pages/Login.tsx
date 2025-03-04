import React, { useState } from 'react';
import '../css/Login.css';
import {useAuth} from "../Context/AuthContext";
import { useNavigate } from 'react-router-dom';

type LoginProps = {
    str: string;
};

const Login = ({str}: LoginProps) =>  {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {login} = useAuth();

    const [sliderValue, setSliderValue] = useState(0);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setSliderValue(value);

        // If value is less than 50%, navigate to Login, else navigate to Signup
        if (value <= 50) {
            navigate('/login');
        } else {
            navigate("/signup");
        }
    };


    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                body: JSON.stringify({username, password}),
                headers: {'Content-Type': 'application/json'},
                credentials: 'include'
            });

            const data = await response.json();
            console.log("Login data ", data)
            if (response.ok) {
                login(data.token, data.user);
                navigate('/');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred during login');
        }
    };

    return (
        <div className="container">
            <div className="heading">{str}</div>
            <form className="form">
                <input
                    placeholder="Username"
                    id="username"
                    type="text"
                    className="input"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required={true}
                />
                <input
                    placeholder="Password"
                    id="password"
                    type="password"
                    className="input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required={true}
                />
                <button className="login-button" onClick={handleLogin}>
                    Login
                </button>
            </form>
            <div className="slider-container">

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    className="slider"
                    onChange={handleSliderChange}
                />
            </div>
        </div>
    );
}

export default Login;
