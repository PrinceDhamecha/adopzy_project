import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BrowsePets from './pages/BrowsePets';
import PetDetails from './pages/PetDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AddPet from './pages/AddPet';
import MyPets from './pages/MyPets';
import MyRequests from './pages/MyRequests';
import ProviderRequests from './pages/ProviderRequests';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar user={user} setUser={setUser} />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/pets" element={<BrowsePets />} />
          <Route path="/pets/:id" element={<PetDetails user={user} />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
          <Route path="/pets/add" element={user?.role === 'provider' ? <AddPet /> : <Navigate to="/login" />} />
          <Route path="/my-pets" element={user?.role === 'provider' ? <MyPets user={user} /> : <Navigate to="/login" />} />
          <Route path="/my-requests" element={user?.role === 'adopter' ? <MyRequests /> : <Navigate to="/login" />} />
          <Route path="/provider/requests" element={user?.role === 'provider' ? <ProviderRequests /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="footer-modern">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h6>About</h6>
              <p>Connecting loving families with pets in need of a forever home. Every adoption saves a life.</p>
            </div>
            <div className="col-md-4">
              <h6>Quick Links</h6>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/pets">Browse Pets</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h6>Mission</h6>
              <p>Promoting responsible pet adoption and supporting the Adopt Don't Shop movement.</p>
            </div>
          </div>
          <hr className="footer-divider" />
          <div className="footer-bottom">
          BCA Project - Prince Dhamecha
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
