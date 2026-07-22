import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import Dashboard from './Pages/Admin/Dashboard'
import Password from './Pages/Staff/Password'
import RaiseTicket from './Pages/Staff/RaiseTicket'
import MyTickets from './Pages/Staff/MyTickets'
import CreateUser from './Pages/Admin/CreateUser'
import ManageUsers from './Pages/Admin/ManageUsers'
import Settings from './Pages/Staff/Settings'

const App = () => {
  return (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/create-user" element={<CreateUser />} />
    <Route path="/manage-users" element={<ManageUsers />} />
    <Route path="/password-change" element={<Password />} />
    <Route path="/raise-ticket" element={<RaiseTicket />} />
    <Route path="/my-tickets" element={<MyTickets />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>)
}

export default App