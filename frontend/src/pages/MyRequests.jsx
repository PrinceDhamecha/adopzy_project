import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../services/api';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/requests/my')
      .then((res) => setRequests(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (status) => {
    const map = {
      pending: 'bg-warning text-dark',
      approved: 'bg-success',
      rejected: 'bg-danger'
    };
    return `badge ${map[status] || 'bg-secondary'}`;
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
      <h3 className="mb-4">My Adoption Requests</h3>

      {requests.length === 0 ? (
        <div className="empty-state">
          <h4>No requests yet</h4>
          <p>Browse available pets and submit an adoption request.</p>
          <a href="/pets" className="btn btn-primary">Browse Pets</a>
        </div>
      ) : (
        <div className="row g-4">
          {requests.map((req) => {
            const imgSrc = getImageUrl(req.pet_image);
            return (
              <div key={req.id} className="col-md-6">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={imgSrc}
                        alt={req.pet_name}
                        style={{ width: 80, height: 80, objectFit: 'cover' }}
                        className="rounded me-3"
                      />
                      <div>
                        <h5 className="mb-1">{req.pet_name}</h5>
                        <span className={statusBadge(req.status)}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted mb-2">
                      <small><strong>Your message:</strong> {req.message}</small>
                    </p>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      <small className="text-muted"><strong>Contact:</strong> {req.contact_number}</small>
                      <small className="text-muted"><strong>City:</strong> {req.city}</small>
                      <small className="text-muted"><strong>Owned pet before:</strong> {req.owned_pet_before === 'yes' ? 'Yes' : 'No'}</small>
                      <small className="text-muted"><strong>Housing:</strong> {req.housing_type?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</small>
                    </div>
                    {req.response_message && (
                      <div className={`p-2 rounded mb-2 ${req.status === 'approved' ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                        <small className={req.status === 'approved' ? 'text-success' : 'text-danger'}>
                          <strong>Provider response:</strong> {req.response_message}
                        </small>
                      </div>
                    )}
                    <small className="text-muted">
                      Requested on {new Date(req.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
