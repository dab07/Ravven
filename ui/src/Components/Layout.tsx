import React from 'react';
import { Outlet } from 'react-router-dom';
import Headers from './Headers';

export default function Layout() {
    return (
        <div className="main">
            <Headers />
            <Outlet />
        </div>
    );
}
