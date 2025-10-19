const { pool } = require('../config/database');

class Contact {
  // Crear contacto
  static async create(contactData) {
    const { name, address, phone, email, facebook, gender, created_by } = contactData;
    
    const [result] = await pool.execute(
      `INSERT INTO contacts (name, address, phone, email, facebook, gender, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, address, phone, email, facebook, gender, created_by]
    );
    
    return this.findById(result.insertId);
  }

  // Buscar contacto por ID
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT c.*, u.username as created_by_username 
       FROM contacts c 
       LEFT JOIN users u ON c.created_by = u.id 
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Obtener todos los contactos de un usuario
  static async findByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM contacts WHERE created_by = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  // Obtener contacto por ID y usuario
  static async findByIdAndUser(id, userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM contacts WHERE id = ? AND created_by = ?',
      [id, userId]
    );
    return rows[0];
  }

  // Obtener todos los contactos
  static async findAll() {
    const [rows] = await pool.execute(
      `SELECT c.*, u.username as created_by_username 
       FROM contacts c 
       LEFT JOIN users u ON c.created_by = u.id 
       ORDER BY c.created_at DESC`
    );
    return rows;
  }

  // Actualizar contacto
  static async update(id, contactData) {
    const { name, address, phone, email, facebook, gender } = contactData;
    
    await pool.execute(
      `UPDATE contacts SET name = ?, address = ?, phone = ?, email = ?, facebook = ?, gender = ? 
       WHERE id = ?`,
      [name, address, phone, email, facebook, gender, id]
    );
    
    return this.findById(id);
  }

  // Eliminar contacto
  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM contacts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Eliminar contacto por usuario
  static async deleteByIdAndUser(id, userId) {
    const [result] = await pool.execute(
      'DELETE FROM contacts WHERE id = ? AND created_by = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Contact;
