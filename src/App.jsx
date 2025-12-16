import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Schedule from './pages/Schedule';
import Results from './pages/Results';
import Standings from './pages/Standings';
import Knockout from './pages/Knockout';
import Admin from './pages/Admin';
import Login from './pages/Login';

function App() {
  return (
    <EventProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Schedule />} />
              <Route path="/results" element={<Results />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/knockout" element={<Knockout />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </EventProvider>
  );
}

export default App;
