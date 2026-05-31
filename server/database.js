/**
 * database.js - Base de datos SQLite para VetClinic
 * 
 * Tablas:
 *   - users         (dueños de mascotas)
 *   - veterinarians (veterinarios)
 *   - pets          (mascotas)
 *   - appointments  (citas)
 *   - clinical_records (expedientes clínicos)
 *   - verification_tokens (tokens de verificación por correo)
 */
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'vetclinic.db');

let db;

export function getDb() {
  if (!db) {
    // Crear carpeta data si no existe
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initTables();
  }
  return db;
}

function initTables() {
  db.exec(`
    -- Usuarios (dueños de mascotas y veterinarios)
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      role TEXT NOT NULL DEFAULT 'dueno' CHECK(role IN ('dueno', 'veterinario', 'admin')),
      specialty TEXT,
      license TEXT,
      years_experience INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      verified INTEGER DEFAULT 0,           -- Email verificado
      verification_token TEXT,               -- Token para verificar email
      avatar TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Tokens de verificación de email
    CREATE TABLE IF NOT EXISTS verification_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('email_verification', 'password_reset')),
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Mascotas
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      breed TEXT,
      age INTEGER,
      weight REAL,
      color TEXT,
      photo_url TEXT,
      medical_notes TEXT,
      owner_id INTEGER NOT NULL,
      created_by INTEGER NOT NULL,
      created_by_role TEXT NOT NULL DEFAULT 'dueno',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    -- Citas
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'Programada' CHECK(status IN ('Programada', 'En curso', 'Completada', 'Cancelada')),
      notes TEXT,
      duration INTEGER DEFAULT 30,
      pet_id INTEGER NOT NULL,
      owner_id INTEGER NOT NULL,
      veterinarian_id INTEGER NOT NULL,
      created_by INTEGER NOT NULL,
      created_by_role TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pet_id) REFERENCES pets(id),
      FOREIGN KEY (owner_id) REFERENCES users(id),
      FOREIGN KEY (veterinarian_id) REFERENCES users(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    -- Expedientes clínicos (solo los crean veterinarios)
    CREATE TABLE IF NOT EXISTS clinical_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      diagnosis TEXT NOT NULL,
      treatment TEXT,
      notes TEXT,
      medications TEXT,
      weight REAL,
      temperature REAL,
      follow_up_date TEXT,
      attachments TEXT, -- JSON array
      pet_id INTEGER NOT NULL,
      owner_id INTEGER NOT NULL,
      veterinarian_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pet_id) REFERENCES pets(id),
      FOREIGN KEY (owner_id) REFERENCES users(id),
      FOREIGN KEY (veterinarian_id) REFERENCES users(id)
    );

    -- Índices
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_pets_owner ON pets(owner_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
    CREATE INDEX IF NOT EXISTS idx_appointments_vet ON appointments(veterinarian_id);
    CREATE INDEX IF NOT EXISTS idx_clinical_records_pet ON clinical_records(pet_id);
  `);
}

// ────────────────────────────────────────────────────────────
// FUNCIONES DE AUTENTICACIÓN
// ────────────────────────────────────────────────────────────

/**
 * Registrar un nuevo usuario
 */
export function registerUser({ name, email, password, phone, address, role, specialty, license }) {
  const db = getDb();
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  const verificationToken = uuidv4();

  const stmt = db.prepare(`
    INSERT INTO users (name, email, password, phone, address, role, specialty, license, verification_token)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(name, email, hashedPassword, phone || null, address || null, role || 'dueno', specialty || null, license || null, verificationToken);

  // Guardar token de verificación
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 horas
  db.prepare(`
    INSERT INTO verification_tokens (user_id, token, type, expires_at)
    VALUES (?, ?, 'email_verification', ?)
  `).run(result.lastInsertRowid, verificationToken, expiresAt);

  return {
    id: result.lastInsertRowid,
    name,
    email,
    role: role || 'dueno',
    verificationToken, // En producción se envía por correo
  };
}

/**
 * Iniciar sesión
 */
export function loginUser(email, password) {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  
  if (!user) return null;
  
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    specialty: user.specialty,
    license: user.license,
    phone: user.phone,
    verified: !!user.verified,
    active: !!user.active,
    avatar: user.avatar || user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
  };
}

/**
 * Verificar email con token
 */
export function verifyEmail(token) {
  const db = getDb();
  
  const tokenRecord = db.prepare(`
    SELECT * FROM verification_tokens 
    WHERE token = ? AND type = 'email_verification' AND used = 0 AND expires_at > datetime('now')
  `).get(token);

  if (!tokenRecord) return { success: false, message: 'Token inválido o expirado' };

  // Marcar token como usado
  db.prepare('UPDATE verification_tokens SET used = 1 WHERE id = ?').run(tokenRecord.id);
  
  // Marcar usuario como verificado
  db.prepare('UPDATE users SET verified = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(tokenRecord.user_id);

  return { success: true, message: 'Email verificado correctamente' };
}

/**
 * Reenviar token de verificación
 */
export function resendVerification(email) {
  const db = getDb();
  const user = db.prepare('SELECT id, verified FROM users WHERE email = ?').get(email);
  
  if (!user) return { success: false, message: 'Usuario no encontrado' };
  if (user.verified) return { success: false, message: 'El email ya está verificado' };

  const newToken = uuidv4();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  // Invalidar tokens anteriores
  db.prepare('UPDATE verification_tokens SET used = 1 WHERE user_id = ? AND type = ?').run(user.id, 'email_verification');
  
  // Crear nuevo token
  db.prepare(`
    INSERT INTO verification_tokens (user_id, token, type, expires_at)
    VALUES (?, ?, 'email_verification', ?)
  `).run(user.id, newToken, expiresAt);

  // Actualizar token en usuario
  db.prepare('UPDATE users SET verification_token = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newToken, user.id);

  return { success: true, verificationToken: newToken };
}

/**
 * Obtener todos los usuarios (para admin)
 */
export function getAllUsers() {
  const db = getDb();
  return db.prepare(`
    SELECT id, name, email, phone, address, role, specialty, license, active, verified, created_at
    FROM users ORDER BY created_at DESC
  `).all();
}

/**
 * Obtener usuario por ID
 */
export function getUserById(id) {
  const db = getDb();
  return db.prepare(`
    SELECT id, name, email, phone, address, role, specialty, license, active, verified, created_at
    FROM users WHERE id = ?
  `).get(id);
}

// ────────────────────────────────────────────────────────────
// CRUD: MASCOTAS
// ────────────────────────────────────────────────────────────

export function getPets(ownerId = null) {
  const db = getDb();
  if (ownerId) {
    return db.prepare(`
      SELECT p.*, u.name as owner_name, u.email as owner_email
      FROM pets p JOIN users u ON p.owner_id = u.id
      WHERE p.owner_id = ? ORDER BY p.created_at DESC
    `).all(ownerId);
  }
  return db.prepare(`
    SELECT p.*, u.name as owner_name, u.email as owner_email
    FROM pets p JOIN users u ON p.owner_id = u.id
    ORDER BY p.created_at DESC
  `).all();
}

export function createPet({ name, species, breed, age, weight, color, owner_id, created_by, created_by_role }) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO pets (name, species, breed, age, weight, color, owner_id, created_by, created_by_role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, species, breed || null, age || null, weight || null, color || null, owner_id, created_by, created_by_role);
  return { id: result.lastInsertRowid, name, species, breed, age, weight, color, owner_id, created_by, created_by_role };
}

export function updatePet(id, data) {
  const db = getDb();
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    if (['name', 'species', 'breed', 'age', 'weight', 'color', 'medical_notes'].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return null;

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  db.prepare(`UPDATE pets SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return db.prepare('SELECT * FROM pets WHERE id = ?').get(id);
}

export function deletePet(id) {
  const db = getDb();
  return db.prepare('DELETE FROM pets WHERE id = ?').run(id);
}

// ────────────────────────────────────────────────────────────
// CRUD: CITAS
// ────────────────────────────────────────────────────────────

export function getAppointments(filters = {}) {
  const db = getDb();
  let query = `
    SELECT a.*, p.name as pet_name, u.name as owner_name, v.name as veterinarian_name
    FROM appointments a
    JOIN pets p ON a.pet_id = p.id
    JOIN users u ON a.owner_id = u.id
    JOIN users v ON a.veterinarian_id = v.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.date) { query += ' AND a.date = ?'; params.push(filters.date); }
  if (filters.veterinarian_id) { query += ' AND a.veterinarian_id = ?'; params.push(filters.veterinarian_id); }
  if (filters.owner_id) { query += ' AND a.owner_id = ?'; params.push(filters.owner_id); }
  if (filters.status) { query += ' AND a.status = ?'; params.push(filters.status); }

  query += ' ORDER BY a.date DESC, a.time ASC';
  return db.prepare(query).all(...params);
}

export function createAppointment(data) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO appointments (date, time, reason, pet_id, owner_id, veterinarian_id, created_by, created_by_role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(data.date, data.time, data.reason, data.pet_id, data.owner_id, data.veterinarian_id, data.created_by, data.created_by_role);
  return { id: result.lastInsertRowid };
}

export function updateAppointment(id, data) {
  const db = getDb();
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    if (['date', 'time', 'reason', 'status', 'notes', 'duration'].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return null;

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  db.prepare(`UPDATE appointments SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
}

// ────────────────────────────────────────────────────────────
// CRUD: EXPEDIENTES CLÍNICOS
// ────────────────────────────────────────────────────────────

export function getClinicalRecords(petId = null) {
  const db = getDb();
  if (petId) {
    return db.prepare(`
      SELECT cr.*, p.name as pet_name, u.name as owner_name, v.name as veterinarian_name
      FROM clinical_records cr
      JOIN pets p ON cr.pet_id = p.id
      JOIN users u ON cr.owner_id = u.id
      JOIN users v ON cr.veterinarian_id = v.id
      WHERE cr.pet_id = ? ORDER BY cr.created_at DESC
    `).all(petId);
  }
  return db.prepare(`
    SELECT cr.*, p.name as pet_name, u.name as owner_name, v.name as veterinarian_name
    FROM clinical_records cr
    JOIN pets p ON cr.pet_id = p.id
    JOIN users u ON cr.owner_id = u.id
    JOIN users v ON cr.veterinarian_id = v.id
    ORDER BY cr.created_at DESC
  `).all();
}

export function createClinicalRecord(data) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO clinical_records (diagnosis, treatment, notes, medications, weight, temperature, follow_up_date, attachments, pet_id, owner_id, veterinarian_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.diagnosis, data.treatment || null, data.notes || null,
    data.medications || null, data.weight || null, data.temperature || null,
    data.follow_up_date || null, data.attachments ? JSON.stringify(data.attachments) : null,
    data.pet_id, data.owner_id, data.veterinarian_id
  );
  return { id: result.lastInsertRowid };
}

// ────────────────────────────────────────────────────────────
// DASHBOARD
// ────────────────────────────────────────────────────────────

export function getDashboardStats() {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];

  return {
    totalUsers: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('dueno').count,
    totalVeterinarians: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('veterinario').count,
    totalPets: db.prepare('SELECT COUNT(*) as count FROM pets').get().count,
    totalAppointments: db.prepare('SELECT COUNT(*) as count FROM appointments').get().count,
    todayAppointments: db.prepare('SELECT COUNT(*) as count FROM appointments WHERE date = ?').get(today).count,
    pendingAppointments: db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status = 'Programada'").get().count,
    completedToday: db.prepare("SELECT COUNT(*) as count FROM appointments WHERE date = ? AND status = 'Completada'").get(today).count,
  };
}
