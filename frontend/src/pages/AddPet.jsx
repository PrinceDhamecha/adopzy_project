import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AddPet() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', species: 'dog', breed: '', age: '', gender: '', location: '', description: ''
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (image) formData.append('image', image);

      await api.post('/pets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/my-pets');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="mb-4">Add a Pet for Adoption</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name *</label>
                    <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Species *</label>
                    <select name="species" className="form-select" value={form.species} onChange={handleChange}>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="bird">Bird</option>
                      <option value="rabbit">Rabbit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Breed</label>
                    <input type="text" name="breed" className="form-control" value={form.breed} onChange={handleChange} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Age (years)</label>
                    <input type="number" name="age" className="form-control" value={form.age} onChange={handleChange} min="0" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Gender</label>
                    <select name="gender" className="form-select" value={form.gender} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location</label>
                    <input type="text" name="location" className="form-control" value={form.location} onChange={handleChange} placeholder="City, State" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Image</label>
                    <input type="file" className="form-control" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
                  {loading ? 'Adding Pet...' : 'Add Pet'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
