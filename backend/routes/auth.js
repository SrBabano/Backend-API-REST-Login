const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.exists(email, username);
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario o email ya existe' });
    }

    // Crear nuevo usuario (solo admins pueden crear otros admins)
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user'
    });

    // Generar token JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
});

module.exports = router;
