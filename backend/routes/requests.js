const express = require('express');
const db = require('../config/db');
const { auth, providerAuth, adopterAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', adopterAuth, async (req, res) => {
  try {
    const { pet_id, message, contact_number, city, owned_pet_before, housing_type } = req.body;

    if (!pet_id) {
      return res.status(400).json({ message: 'Pet ID is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }
    if (!contact_number || !contact_number.trim()) {
      return res.status(400).json({ message: 'Contact number is required' });
    }
    if (!city || !city.trim()) {
      return res.status(400).json({ message: 'City is required' });
    }
    if (!['yes', 'no'].includes(owned_pet_before)) {
      return res.status(400).json({ message: 'Please specify if you have owned a pet before' });
    }
    if (!['apartment', 'independent_house', 'farm_rural_property'].includes(housing_type)) {
      return res.status(400).json({ message: 'Please select a valid housing type' });
    }

    const [pets] = await db.query('SELECT * FROM pets WHERE id = ?', [pet_id]);
    if (pets.length === 0) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    if (pets[0].status !== 'available') {
      return res.status(400).json({ message: 'Pet is not available for adoption' });
    }

    const [existing] = await db.query(
      'SELECT * FROM adoption_requests WHERE pet_id = ? AND adopter_id = ? AND status = "pending"',
      [pet_id, req.user.id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'You already have a pending request for this pet' });
    }

    const [result] = await db.query(
      `INSERT INTO adoption_requests (pet_id, adopter_id, message, contact_number, city, owned_pet_before, housing_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [pet_id, req.user.id, message.trim(), contact_number.trim(), city.trim(), owned_pet_before, housing_type]
    );

    const [request] = await db.query(
      `SELECT r.*, p.name as pet_name, p.image as pet_image
       FROM adoption_requests r JOIN pets p ON r.pet_id = p.id
       WHERE r.id = ?`,
      [result.insertId]
    );
    res.status(201).json(request[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    if (req.user.role !== 'adopter') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const [requests] = await db.query(
      `SELECT r.*, p.name as pet_name, p.image as pet_image
       FROM adoption_requests r JOIN pets p ON r.pet_id = p.id
       WHERE r.adopter_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/provider', providerAuth, async (req, res) => {
  try {
    const [requests] = await db.query(
      `SELECT r.*, p.name as pet_name, p.image as pet_image, u.name as adopter_name, u.email as adopter_email
       FROM adoption_requests r
       JOIN pets p ON r.pet_id = p.id
       JOIN users u ON r.adopter_id = u.id
       WHERE p.provider_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', providerAuth, async (req, res) => {
  try {
    const { status, response_message } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const [requests] = await db.query(
      `SELECT r.*, p.provider_id FROM adoption_requests r JOIN pets p ON r.pet_id = p.id WHERE r.id = ?`,
      [req.params.id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (requests[0].provider_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await db.query(
      'UPDATE adoption_requests SET status = ?, response_message = ? WHERE id = ?',
      [status, response_message || null, req.params.id]
    );

    if (status === 'approved') {
      await db.query('UPDATE pets SET status = "adopted" WHERE id = ?', [requests[0].pet_id]);
    }

    const [updated] = await db.query(
      `SELECT r.*, p.name as pet_name, u.name as adopter_name
       FROM adoption_requests r
       JOIN pets p ON r.pet_id = p.id
       JOIN users u ON r.adopter_id = u.id
       WHERE r.id = ?`,
      [req.params.id]
    );
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    if (req.user.role === 'provider') {
      const [pets] = await db.query(
        `SELECT
          COUNT(*) as totalPets,
          SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as availablePets
         FROM pets WHERE provider_id = ?`,
        [req.user.id]
      );
      const [requests] = await db.query(
        `SELECT COUNT(*) as totalRequests
         FROM adoption_requests r JOIN pets p ON r.pet_id = p.id
         WHERE p.provider_id = ?`,
        [req.user.id]
      );
      res.json({
        totalPets: Number(pets[0].totalPets),
        availablePets: Number(pets[0].availablePets),
        totalRequests: Number(requests[0].totalRequests)
      });
    } else {
      const [requests] = await db.query(
        `SELECT
          COUNT(*) as totalRequests,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingRequests,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approvedRequests
         FROM adoption_requests WHERE adopter_id = ?`,
        [req.user.id]
      );
      res.json({
        totalRequests: Number(requests[0].totalRequests),
        pendingRequests: Number(requests[0].pendingRequests),
        approvedRequests: Number(requests[0].approvedRequests)
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
