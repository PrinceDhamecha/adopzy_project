import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';

export default function PetDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ message: '', contact_number: '', city: '', owned_pet_before: '', housing_type: '' });
  const [submitting, setSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);

  useEffect(() => {
    api.get(`/pets/${id}`)
      .then((res) => setPet(res.data))
      .catch(() => navigate('/pets'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/requests', { pet_id: id, ...form });
      setRequestStatus('success');
      setForm({ message: '', contact_number: '', city: '', owned_pet_before: '', housing_type: '' });
    } catch (err) {
      setRequestStatus(err.response?.data?.message || 'Error submitting request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!pet) return null;

  const imageUrl = getImageUrl(pet.image);
  const isOwner = user?.id === pet.provider_id;

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-6">
          <img src={imageUrl} className="img-fluid pet-detail-img w-100" alt={pet.name} />
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold">{pet.name}</h2>
          <span className={`badge ${pet.status === 'available' ? 'bg-success' : 'bg-secondary'} status-badge mb-3`}>
            {pet.status}
          </span>

          <table className="table table-borderless">
            <tbody>
              <tr>
                <td className="fw-semibold">Species</td>
                <td>{pet.species}</td>
              </tr>
              {pet.breed && (
                <tr>
                  <td className="fw-semibold">Breed</td>
                  <td>{pet.breed}</td>
                </tr>
              )}
              {pet.age !== null && (
                <tr>
                  <td className="fw-semibold">Age</td>
                  <td>{pet.age} years</td>
                </tr>
              )}
              {pet.gender && (
                <tr>
                  <td className="fw-semibold">Gender</td>
                  <td className="text-capitalize">{pet.gender}</td>
                </tr>
              )}
              <tr>
                <td className="fw-semibold">Location</td>
                <td>{pet.location || 'Not specified'}</td>
              </tr>
              <tr>
                <td className="fw-semibold">Provider</td>
                <td>{pet.provider_name}</td>
              </tr>
            </tbody>
          </table>

          {pet.description && (
            <div className="mb-4">
              <h6 className="fw-semibold">Description</h6>
              <p className="text-muted">{pet.description}</p>
            </div>
          )}

          {user?.role === 'adopter' && pet.status === 'available' && (
            <div className="mt-4">
              <h5>Request Adoption</h5>
              {requestStatus === 'success' ? (
                <div className="alert alert-success">
                  Adoption request submitted successfully!
                </div>
              ) : requestStatus && typeof requestStatus === 'string' ? (
                <div className="alert alert-danger">{requestStatus}</div>
              ) : null}
              <form onSubmit={handleRequest}>
                <div className="mb-3">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell the provider why you'd like to adopt this pet..."
                    required
                  />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Contact Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="contact_number"
                      value={form.contact_number}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Have you owned a pet before? *</label>
                    <select
                      className="form-select"
                      name="owned_pet_before"
                      value={form.owned_pet_before}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Housing Type *</label>
                    <select
                      className="form-select"
                      name="housing_type"
                      value={form.housing_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="apartment">Apartment</option>
                      <option value="independent_house">Independent House</option>
                      <option value="farm_rural_property">Farm / Rural Property</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Request Adoption'}
                </button>
              </form>
            </div>
          )}

          {isOwner && (
            <div className="alert alert-info mt-3">
              This is your pet listing.
            </div>
          )}

          {!user && (
            <div className="alert alert-info mt-3">
              <a href="/login" className="alert-link">Login</a> to request adoption.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
