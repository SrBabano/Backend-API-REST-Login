const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { auth } = require('../middleware/auth');

// Obtener todos los contactos del usuario autenticado
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.findByUserId(req.user.id);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo contactos', error: error.message });
  }
});

// Obtener contacto por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUser(req.params.id, req.user.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo contacto', error: error.message });
  }
});

// Crear nuevo contacto
router.post('/', auth, async (req, res) => {
  try {
    const { name, address, phone, email, facebook, gender } = req.body;

    const contact = await Contact.create({
      name,
      address,
      phone,
      email,
      facebook,
      gender,
      created_by: req.user.id
    });

    res.status(201).json({ message: 'Contacto creado exitosamente', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error creando contacto', error: error.message });
  }
});

// Actualizar contacto
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, address, phone, email, facebook, gender } = req.body;

    // Verificar que el contacto pertenece al usuario
    const existingContact = await Contact.findByIdAndUser(req.params.id, req.user.id);
    if (!existingContact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    const contact = await Contact.update(req.params.id, {
      name, address, phone, email, facebook, gender
    });

    res.json({ message: 'Contacto actualizado exitosamente', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando contacto', error: error.message });
  }
});

// Eliminar contacto
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Contact.deleteByIdAndUser(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    res.json({ message: 'Contacto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando contacto', error: error.message });
  }
});

module.exports = router;
