const express = require('express');
const db = require('../config/db');
const { auth, providerAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let query = `SELECT p.*, u.name as provider_name FROM pets p JOIN users u ON p.provider_id = u.id WHERE p.status = 'available'`;
    const params = [];

    if (req.query.species) {
      query += ' AND p.species = ?';
      params.push(req.query.species);
    }
    if (req.query.location) {
      query += ' AND p.location LIKE ?';
      params.push(`%${req.query.location}%`);
    }
    if (req.query.search) {
      query += ' AND (p.name LIKE ? OR p.breed LIKE ? OR p.description LIKE ?)';
      params.push(`%${req.query.search}%`, `%${req.query.search}%`, `%${req.query.search}%`);
    }

    query += ' ORDER BY p.created_at DESC';

    const [pets] = await db.query(query, params);
    res.json(pets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const [pets] = await db.query(
      'SELECT * FROM pets WHERE provider_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(pets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [pets] = await db.query(
      'SELECT p.*, u.name as provider_name FROM pets p JOIN users u ON p.provider_id = u.id WHERE p.id = ?',
      [req.params.id]
    );
    if (pets.length === 0) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pets[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', providerAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, species, breed, age, gender, location, description } = req.body;

    if (!name || !species) {
      return res.status(400).json({ message: 'Name and species are required' });
    }

    const image = req.file ? req.file.filename : null;

    const [result] = await db.query(
      `INSERT INTO pets (provider_id, name, species, breed, age, gender, location, description, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, species, breed || null, age || null, gender || null, location || null, description || null, image]
    );

    const [pet] = await db.query('SELECT * FROM pets WHERE id = ?', [result.insertId]);
    res.status(201).json(pet[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', providerAuth, upload.single('image'), async (req, res) => {
  try {
    const [pets] = await db.query(
      'SELECT * FROM pets WHERE id = ? AND provider_id = ?',
      [req.params.id, req.user.id]
    );
    if (pets.length === 0) {
      return res.status(404).json({ message: 'Pet not found or unauthorized' });
    }

    const pet = pets[0];
    const { name, species, breed, age, gender, location, description } = req.body;
    const image = req.file ? req.file.filename : pet.image;

    await db.query(
      `UPDATE pets SET name=?, species=?, breed=?, age=?, gender=?, location=?, description=?, image=?
       WHERE id=?`,
      [
        name || pet.name,
        species || pet.species,
        breed !== undefined ? breed : pet.breed,
        age !== undefined ? age : pet.age,
        gender !== undefined ? gender : pet.gender,
        location !== undefined ? location : pet.location,
        description !== undefined ? description : pet.description,
        image,
        req.params.id
      ]
    );

    const [updated] = await db.query('SELECT * FROM pets WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', providerAuth, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM pets WHERE id = ? AND provider_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pet not found or unauthorized' });
    }
    res.json({ message: 'Pet deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
