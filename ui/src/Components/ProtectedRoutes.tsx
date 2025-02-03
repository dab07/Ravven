import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <NavLink to="/login" end/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
