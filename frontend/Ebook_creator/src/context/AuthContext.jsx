import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        checkAuthStatus() ;
    }, []);

    const checkAuthStatus = async () => {
        try{
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");

            if(token && userStr){
                const userData = JSON.parse(userStr);
                setUser(userData);
                setIsAuthenticated(true);
            }

        }catch(error){
            console.error("Error checking auth
    };
    const login = (userData, token) => {};
    const logout = () => {};
    const updateUser = (updatedUserData) => {};

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        checkAuthStatus,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
