import { useState, useEffect } from 'react';
import api from '../services/api';

export default function ProviderRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedAction, setSelectedAction] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const fetchRequests = () => {
    setLoading(true);
    api.get('/requests/provider')
      .then((res) => setRequests(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openModal = (id, action) => {
    setSelectedId(id);
    setSelectedAction(action);
    setResponseMessage('');
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      await api.put(`/requests/${selectedId}`, {
        status: selectedAction,
        response_message: responseMessage
      });
      setShowModal(false);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

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
      <h3 className="mb-4">Adoption Requests Received</h3>

      {requests.length === 0 ? (
        <div className="empty-state">
          <h4>No requests received</h4>
          <p>Requests from adopters will appear here.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Pet</th>
                <th>Adopter</th>
                <th>Contact</th>
                <th>City</th>
                <th>Owned Pet Before</th>
                <th>Housing Type</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
                <th>Your Response</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="fw-semibold">{req.pet_name}</td>
                  <td>{req.adopter_name}<br /><small className="text-muted">{req.adopter_email}</small></td>
                  <td>{req.contact_number}</td>
                  <td>{req.city}</td>
                  <td>{req.owned_pet_before === 'yes' ? 'Yes' : 'No'}</td>
                  <td className="text-capitalize">{req.housing_type?.replace(/_/g, ' ')}</td>
                  <td style={{ maxWidth: 200, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {req.message}
                  </td>
                  <td>{new Date(req.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={statusBadge(req.status)}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {req.status === 'pending' ? (
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-success" onClick={() => openModal(req.id, 'approved')}>Approve</button>
                        <button className="btn btn-sm btn-danger" onClick={() => openModal(req.id, 'rejected')}>Reject</button>
                      </div>
                    ) : (
                      <span className="text-muted small">Processed</span>
                    )}
                  </td>
                  <td style={{ maxWidth: 200, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {req.response_message || <span className="text-muted">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectedAction === 'approved' ? 'Approve' : 'Reject'} Adoption Request
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Response Message</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder={`Write a message to the adopter about why you're ${selectedAction === 'approved' ? 'approving' : 'rejecting'} this request...`}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button
                    className={`btn ${selectedAction === 'approved' ? 'btn-success' : 'btn-danger'}`}
                    onClick={handleConfirm}
                  >
                    {selectedAction === 'approved' ? 'Approve' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
