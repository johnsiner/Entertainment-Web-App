import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../store/authContext';

export default function ProtectedRoute({ children }) {
   const authContext = useContext(AuthContext);
   return authContext.token ? children : <Navigate to="/auth" />;
}
