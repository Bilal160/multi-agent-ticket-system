import { Routes, Route } from 'react-router-dom'
import './App.css'
import { TicketView } from './pages/TicketView'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminTicketDetail } from './pages/AdminTicketDetail'
import { LandingPage } from './pages/LandingPage'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tickets/:id" element={<TicketView />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/tickets/:id" element={<AdminTicketDetail />} />
      </Routes>
    </>
  )
}

export default App
