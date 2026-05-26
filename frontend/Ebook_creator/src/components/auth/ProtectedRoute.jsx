import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({children}) {
    const isAuth = true;
    const loading = false;
    const location = useLocation();

    if(loading){
        return <div>LOADING...</div>
    }
    if(!isAuth){
        return <Navigate to="/login" state= {{from: location}} replace />
        // state={{ from: location }} 
        // --> This stores where the user came from
    }
    return children;
}

export default ProtectedRoute