const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const { auth, adminAuth } = require('../middleware/auth');

// Obtener todos los usuarios (solo admin)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo usuarios', error: error.message });
  }
});

// Obtener usuario por ID (solo admin)
router.get('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo usuario', error: error.message });
  }
});

// Crear nuevo usuario (solo admin)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.exists(email, username);
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario o email ya existe' });
    }

    const user = await User.create({ username, email, password, role });

    res.status(201).json({ 
      message: 'Usuario creado exitosamente',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creando usuario', error: error.message });
  }
});

// Actualizar usuario (solo admin)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { username, email, role } = req.body;

    const user = await User.update(req.params.id, { username, email, role });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado exitosamente', user });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando usuario', error: error.message });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando usuario', error: error.message });
  }
});

module.exports = router;
