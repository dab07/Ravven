import React, { useState } from 'react';
import '../css/Login.css';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../Context/AuthContext";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [sliderValue, setSliderValue] = useState(0);
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth();

    const loggingIn = async (username: string, password: string) => {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();
            if (response.ok) {
                login(result.user)
                navigate('/');
            }
            console.log('Login response:', result);
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setSliderValue(value);

        if (value > 50) {
            setIsSignup(true);
            navigate('/signup');
        } else {
            setIsSignup(false);
            navigate('/login');
        }
    };

    const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        loggingIn(username, password);
    };

    return (
        <div className="main-container">
            <div className="cylinder-container">
                <div className={`cylinder-box ${isSignup ? 'flipped' : ''}`}>
                    <div className="form-container login">
                        <div className="heading">Login</div>
                        <form className="form">
                            <input
                                placeholder="Username"
                                type="text"
                                className="input"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                            <input
                                placeholder="Password"
                                type="password"
                                className="input"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button className="login-button" onClick={handleLogin}>
                                Login
                            </button>
                        </form>
                    </div>

                    <div className="form-container signup">
                        <div className="heading">Signup</div>
                        <form className="form">
                            <input
                                placeholder="Username"
                                type="text"
                                className="input"
                                required
                            />
                            <input
                                placeholder="Password"
                                type="password"
                                className="input"
                                required
                            />
                            <input
                                placeholder="Confirm Password"
                                type="password"
                                className="input"
                                required
                            />
                            <button className="login-button">
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            </div>

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
            <div className="slider-labels">
                <span>« Slide here to Login</span>
                <span>Slide here to Signup »</span>
            </div>
        </div>
    );
};

export default Login;
