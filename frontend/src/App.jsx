import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'

import Home from './pages/Home/index'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Search from './pages/Search/index'
import PropertyDetail from './pages/Property/index'
import NotFound from './pages/NotFound'

import Dashboard from './pages/Dashboard/index'
import Reservations from './pages/Dashboard/Student/Reservations'
import Favorites from './pages/Dashboard/Student/Favorites'
import Messages from './pages/Dashboard/Student/Messages'
import Documents from './pages/Dashboard/Student/Documents'
import Settings from './pages/Dashboard/Student/Settings'
import MyListings from './pages/Dashboard/Owner/MyListings'
import NewListing from './pages/Dashboard/Owner/NewListing'
import EditListing from './pages/Dashboard/Owner/EditListing'
import Requests from './pages/Dashboard/Owner/Requests'
import Verification from './pages/Dashboard/Owner/Verification'
import StudentProfile from './pages/Dashboard/Student/Profile'
import PublicProfile from './pages/Profile/index'
import VerifyEmail from './pages/Auth/VerifyEmail'
import SobreNosotros from './pages/Static/SobreNosotros'
import Privacidad from './pages/Static/Privacidad'
import Comisiones from './pages/Static/Comisiones'
import ComoFunciona from './pages/Static/ComoFunciona'
import PagoEscrow from './pages/Static/PagoEscrow'

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30000 } } })

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/buscar" element={<Search />} />
            <Route path="/piso/:id" element={<PropertyDetail />} />
            <Route path="/perfil/:id" element={<PublicProfile />} />
            <Route path="/verificar-email" element={<VerifyEmail />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/comisiones" element={<Comisiones />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="/pago-escrow" element={<PagoEscrow />} />

            <Route path="/panel" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            }>
              <Route index element={<Navigate to="reservas" replace />} />
              <Route path="reservas"      element={<Reservations />} />
              <Route path="favoritos"     element={<Favorites />} />
              <Route path="anuncios"             element={<MyListings />} />
              <Route path="anuncios/nuevo"      element={<NewListing />} />
              <Route path="anuncios/:id/editar" element={<EditListing />} />
              <Route path="solicitudes"   element={<Requests />} />
              <Route path="mensajes"      element={<Messages />} />
              <Route path="documentos"    element={<Documents />} />
              <Route path="verificacion"  element={<Verification />} />
              <Route path="configuracion" element={<Settings />} />
              <Route path="perfil" element={<StudentProfile />} />
            </Route>

            {/* Legacy redirects */}
            <Route path="/panel/estudiante/*" element={<Navigate to="/panel" replace />} />
            <Route path="/panel/propietario/*" element={<Navigate to="/panel" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
