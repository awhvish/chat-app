import { Route, Routes } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import LogInPage from './components/pages/LogInPage.jsx';
import SignUpPage from './components/pages/SignUpPage.jsx';
import ProfilePage from './components/pages/ProfilePage.jsx';
import SettingsPage from './components/pages/SettingsPage.jsx';
import HomePage from './components/pages/HomePage.jsx';

function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/signup' element={<SignUpPage />}></Route>
        <Route path='/login' element={<LogInPage />}></Route>
        <Route path='/settings' element={<SettingsPage />}></Route>
        <Route path='/profile' element={<ProfilePage />}></Route>
      </Routes>
    </>
  )
}

export default App
