import { useState, useEffect } from 'react';
import api from '../services/api';
import PetCard from '../components/PetCard';

export default function BrowsePets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');

  const fetchPets = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (species) params.species = species;
    if (location) params.location = location;

    api.get('/pets', { params })
      .then((res) => setPets(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPets();
  };

  const handleReset = () => {
    setSearch('');
    setSpecies('');
    setLocation('');
    setLoading(true);
    api.get('/pets')
      .then((res) => setPets(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Browse Pets for Adoption</h2>

      <div className="filter-section mb-4">
        <form onSubmit={handleSearch}>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Name, breed, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Species</label>
              <select className="form-select" value={species} onChange={(e) => setSpecies(e.target.value)}>
                <option value="">All Species</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="City or area..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-grid">
              <button type="submit" className="btn btn-primary">Search</button>
              <button type="button" className="btn btn-outline-secondary mt-1" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : pets.length === 0 ? (
        <div className="empty-state">
          <h4>No pets found</h4>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="row">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}
