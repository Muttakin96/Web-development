import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import ProtectedRoute from './ProtectedRoute'
import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import Register from './Pages/Register'
import Cart from './Pages/Cart'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                    <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App