import React from 'react'
import ChatRoom from './pages/ChatRoom'
import { Routes, Route } from 'react-router-dom';
import { Index } from './pages/Login';
import { Register } from './pages/Register';
import { ChatSelector } from './pages/ChatSelection';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/chat-selection" element={<ChatSelector/>}/>
      <Route path="/chatroom/*" element={<ChatRoom/>}/>
    </Routes>
  )
}

export default App