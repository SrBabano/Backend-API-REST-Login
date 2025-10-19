const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Crear usuario
  static async create(userData) {
    const { username, email, password, role = 'user' } = userData;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );
    
    return this.findById(result.insertId);
  }

  // Buscar usuario por ID
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  // Buscar usuario por username
  static async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  // Obtener todos los usuarios
  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  // Actualizar usuario
  static async update(id, userData) {
    const { username, email, role } = userData;
    
    await pool.execute(
      'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
      [username, email, role, id]
    );
    
    return this.findById(id);
  }

  // Eliminar usuario
  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Comparar contraseña
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Verificar si email o username existen
  static async exists(email, username) {
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    return rows.length > 0;
  }
}

module.exports = User;
