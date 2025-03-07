import React, { useState } from 'react';
import '../css/Login.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sliderValue, setSliderValue] = useState(100);
    const [isSignup, setIsSignup] = useState(true);
    const navigate = useNavigate();

    const signingUp = async (username: string, password: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            console.log('Sign-up response:', data);
        } catch (error) {
            console.error('Error during sign-up:', error);
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setSliderValue(value);

        if (value <= 50) {
            setIsSignup(false);
            navigate('/login');
        } else {
            setIsSignup(true);
            navigate('/signup');
        }
    };

    const handleSignUp = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        signingUp(username, password);
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
                            <button className="login-button">
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
                            <input
                                placeholder="Confirm Password"
                                type="password"
                                className="input"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button className="login-button" onClick={handleSignUp}>
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

export default Signup;
