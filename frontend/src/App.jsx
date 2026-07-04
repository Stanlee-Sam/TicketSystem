import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import Dashboard from './Pages/Admin/Dashboard'
import Password from './Pages/Staff/Password'

const App = () => {
  return (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/password-change" element={<Password />} />
  </Routes>)
}

export default App