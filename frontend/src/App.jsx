import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import LogInPage from './pages/LogInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import HomePage from './pages/HomePage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

function App() {

  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'></Loader>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />}></Route>
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />}></Route>
        <Route path='/login' element={!authUser ? <LogInPage /> : <Navigate to="/" />}></Route>
        <Route path='/settings' element={<SettingsPage />}></Route>
        <Route path='/profile' element={authUser ? <ProfilePage /> :  <Navigate to="/login"></Navigate>  }></Route>
      </Routes>
    </>
  )
}

export default App
