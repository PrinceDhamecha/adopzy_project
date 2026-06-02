import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

export default function PetCard({ pet }) {
  const imageUrl = getImageUrl(pet.image);

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card pet-card h-100 shadow-sm">
        <img src={imageUrl} className="card-img-top" alt={pet.name} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold">{pet.name}</h5>
          <p className="card-text text-muted mb-1">
            <small>{pet.species} {pet.breed ? `- ${pet.breed}` : ''}</small>
          </p>
          <p className="card-text text-muted mb-2">
            <small>{pet.location || 'Location not specified'}</small>
          </p>
          <div className="mt-auto">
            <Link to={`/pets/${pet.id}`} className="btn btn-outline-primary w-100">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
