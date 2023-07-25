import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import HomePage from './components/pages/HomePage'
import ChatPage from './components/pages/ChatPage'
function App() {

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/chats' element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default App
