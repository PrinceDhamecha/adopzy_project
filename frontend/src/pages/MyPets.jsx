import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function MyPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPets = () => {
    setLoading(true);
    api.get('/pets/my')
      .then((res) => setPets(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;
    try {
      await api.delete(`/pets/${id}`);
      setPets(pets.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">My Pets</h3>
        <Link to="/pets/add" className="btn btn-primary">Add New Pet</Link>
      </div>

      {pets.length === 0 ? (
        <div className="empty-state">
          <h4>No pets listed yet</h4>
          <p>Add your first pet listing to start receiving adoption requests.</p>
          <Link to="/pets/add" className="btn btn-primary">Add a Pet</Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => {
                const imgSrc = pet.image ? (pet.image.startsWith('http') ? pet.image : `/uploads/${pet.image}`) : 'https://via.placeholder.com/50';
                return (
                  <tr key={pet.id}>
                    <td>
                      <img src={imgSrc} alt={pet.name} style={{ width: 50, height: 50, objectFit: 'cover' }} className="rounded" />
                    </td>
                    <td className="fw-semibold">{pet.name}</td>
                    <td>{pet.species}</td>
                    <td>{pet.breed || '-'}</td>
                    <td>{pet.location || '-'}</td>
                    <td>
                      <span className={`badge ${pet.status === 'available' ? 'bg-success' : 'bg-secondary'}`}>
                        {pet.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/pets/${pet.id}`} className="btn btn-sm btn-outline-primary me-1">View</Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(pet.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
