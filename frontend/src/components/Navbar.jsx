import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-modern">
      <div className="container">
        <Link className="navbar-brand" to="/">
          ADOPZY
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pets">Browse Pets</Link>
            </li>
            {user?.role === 'provider' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/pets/add">Add Pet</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-pets">My Pets</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/provider/requests">Requests</Link>
                </li>
              </>
            )}
            {user?.role === 'adopter' && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-requests">My Requests</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav align-items-center gap-2">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-user-name d-block">{user.name}</span>
                  <span className="nav-user-role d-block">{user.role}</span>
                </li>
                <li className="nav-item d-flex align-items-center">
                  <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn-login nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn-register nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
