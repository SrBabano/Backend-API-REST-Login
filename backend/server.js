const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 54055;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar base de datos
initializeDatabase();

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/contacts', require('./routes/contacts'));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Ruta no encontrada
app.use(function(req, res, next){
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
