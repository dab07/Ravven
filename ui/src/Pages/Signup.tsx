import React, { useState } from 'react';
import '../css/Login.css';
import {useNavigate} from 'react-router-dom'

type SignupProps = {
    str: string;
};

const Signup = ({ str }: SignupProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sliderValue, setSliderValue] = useState(100);
    const navigate = useNavigate();

    const signingUp = async (username: string, password: string) => {
        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                body: JSON.stringify({ username, password}),
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();
            console.log('Sign-up response:', result);
        } catch (error) {
            console.error('Error during sign-up:', error);
        }
    };

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

    const handleSignUp = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        signingUp(username, password);
    };

    return (
        <div className="container">
            <div className="heading">{str}</div>
            <form className="form">
                <input
                    placeholder="E-mail"
                    id="email"
                    type="email"
                    className="input"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required={true}
                />
                <input
                    placeholder="Password"
                    id="password"
                    type="password"
                    value={password}
                    className="input"
                    onChange={e => setPassword(e.target.value)}
                    required={true}
                />
                <input
                    placeholder="Password"
                    id="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    type="password"
                    className="input"
                    required={true}
                />
                <button className="login-button" onClick={handleSignUp}>
                    Sign Up
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
};

export default Signup;
