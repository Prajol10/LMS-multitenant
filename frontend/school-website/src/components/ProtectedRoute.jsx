import { Navigate, useParams } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const { school } = useParams();

  if (!token) {
    if (school) return <Navigate to={`/${school}/admin`} replace />;
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    if (school) return <Navigate to={`/${school}/admin`} replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
