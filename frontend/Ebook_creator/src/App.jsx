import React from 'react';
import {Routes,Route} from 'react-router-dom';
import ProtectedRoutes from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import ProfilePage from './pages/ProfilePage';
import ViewBookPage from './pages/ViewBookPage';


const App = () => {
  return (
    <div>
      <Routes>
       <Route path="/" element={<LandingPage/>}/>
       <Route path="/login" element={<LoginPage/>}/>
       <Route path="/" element={<SignupPage/>}/>

       <Route path="/dashboard" element={<ProtectedRoutes><DashboardPage/></ProtectedRoutes>}/>
       <Route path="/editor/:bookId" element={<ProtectedRoutes><EditorPage/></ProtectedRoutes>}/>
       <Route path="/view-book/:bookId" element={<ProtectedRoutes><ViewBookPage/></ProtectedRoutes>}/>
       <Route path="/profile" element={<ProtectedRoutes><ProfilePage/></ProtectedRoutes>}/>
       
      </Routes>
    </div>
  )
}

export default App