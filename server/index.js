/**
 * server/index.js - Servidor API VetClinic con SQLite
 * 
 * Inicio:
 *   cd server
 *   npm install
 *   npm run dev
 * 
 * Endpoints:
 *   POST   /api/auth/register    - Registrar usuario
 *   POST   /api/auth/login       - Iniciar sesión
 *   POST   /api/auth/verify      - Verificar email con token
 *   POST   /api/auth/resend      - Reenviar token de verificación
 *   GET    /api/auth/me          - Obtener usuario actual
 *   GET    /api/users            - Listar usuarios (admin)
 *   GET    /api/pets             - Listar mascotas
 *   POST   /api/pets             - Crear mascota
 *   PUT    /api/pets/:id         - Actualizar mascota
 *   DELETE /api/pets/:id         - Eliminar mascota
 *   GET    /api/appointments     - Listar citas
 *   POST   /api/appointments     - Crear cita
 *   PUT    /api/appointments/:id - Actualizar cita
 *   GET    /api/clinical-records - Listar expedientes
 *   POST   /api/clinical-records - Crear expediente (solo veterinarios)
 *   GET    /api/dashboard/stats  - Estadísticas del dashboard
 */
import express from 'express';
import cors from 'cors';
import {
  getDb,
  registerUser,
  loginUser,
  verifyEmail,
  resendVerification,
  getAllUsers,
  getUserById,
  getPets,
  createPet,
  updatePet,
  deletePet,
  getAppointments,
  createAppointment,
  updateAppointment,
  getClinicalRecords,
  createClinicalRecord,
  getDashboardStats,
} from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8501', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// ────────────────────────────────────────────────────────────
// MIDDLEWARE DE AUTENTICACIÓN
// ────────────────────────────────────────────────────────────

/**
 * Extrae el usuario del token (simplificado para desarrollo)
 * En producción usar JWT
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // En desarrollo, permitir peticiones sin auth
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    // Token simple: userId:timestamp
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const user = getUserById(decoded.userId);
    req.user = user;
  } catch {
    req.user = null;
  }
  next();
}

app.use('/api', authMiddleware);

// ────────────────────────────────────────────────────────────
// ENDPOINTS DE AUTENTICACIÓN
// ────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Registra un nuevo usuario y devuelve el token de verificación
 */
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone, address, role, specialty, license } = req.body;

    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nombre, email y contraseña son requeridos' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres' });
    }
    if (!email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Email inválido' });
    }

    const result = registerUser({ name, email, password, phone, address, role, specialty, license });

    res.json({
      success: true,
      message: 'Usuario registrado correctamente. Revisa tu correo para verificar tu email.',
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
        // En desarrollo, devolvemos el token para pruebas
        verificationToken: result.verificationToken,
        verificationUrl: `http://localhost:5173/verify-email?token=${result.verificationToken}`,
      },
    });
  } catch (error) {
    if (error.message?.includes('UNIQUE constraint')) {
      return res.status(409).json({ success: false, message: 'El email ya está registrado' });
    }
    console.error('Error en registro:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * POST /api/auth/login
 * Inicia sesión y devuelve un token
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
    }

    const user = loginUser(email, password);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // Generar token simple (en producción usar JWT)
    const token = Buffer.from(JSON.stringify({ userId: user.id, timestamp: Date.now() })).toString('base64');

    res.json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * POST /api/auth/verify
 * Verifica el email con un token
 */
app.post('/api/auth/verify', (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token requerido' });
    }

    const result = verifyEmail(token);
    res.json(result);
  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * POST /api/auth/resend
 * Reenvía el token de verificación
 */
app.post('/api/auth/resend', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email requerido' });
    }

    const result = resendVerification(email);
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: 'Token reenviado',
      verificationToken: result.verificationToken,
    });
  } catch (error) {
    console.error('Error al reenviar:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

/**
 * GET /api/auth/me
 * Obtiene el usuario actual
 */
app.get('/api/auth/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'No autenticado' });
  }
  res.json({ success: true, data: req.user });
});

// ────────────────────────────────────────────────────────────
// ENDPOINTS CRUD
// ────────────────────────────────────────────────────────────

/**
 * GET /api/users
 * Lista todos los usuarios (solo admin/vet pueden ver todos)
 */
app.get('/api/users', (req, res) => {
  try {
    const users = getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ success: false, message: 'Error interno' });
  }
});

/**
 * GET /api/users/:id
 */
app.get('/api/users/:id', (req, res) => {
  try {
    const user = getUserById(parseInt(req.params.id));
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno' });
  }
});

/**
 * GET /api/pets
 * Query params: owner_id (opcional)
 */
app.get('/api/pets', (req, res) => {
  try {
    const ownerId = req.query.owner_id ? parseInt(req.query.owner_id) : null;
    const pets = getPets(ownerId);
    res.json({ success: true, data: pets });
  } catch (error) {
    console.error('Error al obtener mascotas:', error);
    res.status(500).json({ success: false, message: 'Error interno' });
  }
});

/**
 * POST /api/pets
 * Crea una mascota. Solo dueños pueden crear mascotas.
 */
app.post('/api/pets', (req, res) => {
  try {
    const { name, species, breed, age, weight, color, owner_id } = req.body;
    
    if (!name || !species) {
      return res.status(400).json({ success: false, message: 'Nombre y especie son requeridos' });
    }

    const userId = req.user?.id || owner_id || 1; // Fallback para desarrollo
    const userRole = req.user?.role || 'dueno';

    const pet = createPet({
      name, species, breed, age, weight, color,
      owner_id: userId,
      created_by: userId,
      created_by_role: userRole,
    });

    res.status(201).json({ success: true, data: pet, message: 'Mascota registrada' });
  } catch (error) {
    console.error('Error al crear mascota:', error);
    res.status(500).json({ success: false, message: 'Error interno' });
  }
});

/**
 * PUT /api/pets/:id
 * Solo el creador puede modificar
 */
app.put('/api/pets/:id', (req, res) => {
  try {
    const petId = parseInt(req.params.id);
    const pets = getPets();
    const pet = pets.find(p => p.id === petId);

    if (!pet) return res.status(404).json({ success: false, message: 'Mascota no encontrada' });

    // Verificar propiedad (solo el creador puede modificar)
    if (req.user && pet.created_by !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para modificar esta mascota' });
    }

    const updated = updatePet(petId, req.body);
    res.json({ success: true, data: updated, message: 'Mascota actualizada' });
  } catch (error) {
    console.error('Error al actualizar mascota:', error);
    res.status(500).json({ success: false, message: 'Error interno' });
  }
});

/**
 * DELETE /api/pets/:id
 */
app.delete('/api/pets/:id', (req, res) => {
  try {
    const petId = parseInt(req.params.id);
    deletePet(petId);
    res.json({ success: true, message: 'Mascota eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno' });
  }
});

/**
 * GET /api/appointments
 * Query params: date, veterinarian_id, owner_id, status
 */
app.get('/api/appointments', (req, res) => {
  try {
    const filters = {};
    if (req.query.date) filters.date = req.query.date;
    if (req.query.veterinarian_id) filters.veterinarian_id = parseInt(req.query.veterinarian_id);
    if (req.query.owner_id) filters.owner_id = parseInt(req.query.owner_id);
    if (req.query.status) filters.status = req.query.status;

    const appointments = getAppointments(filters);
    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ success: false, message: 'Error interno' });
  }
});

/**
 * POST /api/appointments
 */
app.post('/api/appointments', (req, res) => {
  try {
    const { date, time, reason, pet_id, owner_id, veterinarian_id } = req.body;
    
    if (!date || !time || !reason || !pet_id || !veterinarian_id) {
      return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    const userId = req.user?.id || owner_id;
    const userRole = req.user?.role || 'dueno';

    const appointment = createAppointment({
      date, time, reason, pet_id,
      owner_id: userId,
      veterinarian_id,
      created_by: userId,
      created_by_role: userRole,
    });

    res.status(201).json({ success: true, data: appointment, message: 'Cita creada' });
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ success: false, message: 'Error interno' });
  }
});

/**
 * PUT /api/appointments/:id
 */
app.put('/api/appointments/:id', (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id);
    const updated = updateAppointment(appointmentId, req.body);

    if (!updated) return res.status(404).json({ success: false, message: 'Cita no encontrada' });

    // Verificar propiedad
    if (req.user && updated.created_by !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para modificar esta cita' });
    }

    res.json({ success: true, data: updated, message: 'Cita actualizada' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno' });
  }
});

/**
 * GET /api/clinical-records
 * Query params: pet_id (opcional)
 */
app.get('/api/clinical-records', (req, res) => {
  try {
    const petId = req.query.pet_id ? parseInt(req.query.pet_id) : null;
    const records = getClinicalRecords(petId);
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno' });
  }
});

/**
 * POST /api/clinical-records
 * Solo veterinarios pueden crear expedientes
 */
app.post('/api/clinical-records', (req, res) => {
  try {
    const { diagnosis, treatment, notes, medications, weight, temperature, follow_up_date, pet_id, owner_id } = req.body;

    if (!diagnosis || !pet_id || !owner_id) {
      return res.status(400).json({ success: false, message: 'Diagnóstico, mascota y dueño son requeridos' });
    }

    // Verificar que sea veterinario
    if (req.user && req.user.role !== 'veterinario') {
      return res.status(403).json({ success: false, message: 'Solo veterinarios pueden crear expedientes clínicos' });
    }

    const vetId = req.user?.id || 1;
    const record = createClinicalRecord({
      diagnosis, treatment, notes, medications, weight, temperature, follow_up_date,
      pet_id, owner_id,
      veterinarian_id: vetId,
    });

    res.status(201).json({ success: true, data: record, message: 'Expediente clínico creado' });
  } catch (error) {
    console.error('Error al crear expediente:', error);
    res.status(500).json({ success: false, message: 'Error interno' });
  }
});

/**
 * GET /api/dashboard/stats
 */
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const stats = getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno' });
  }
});

// ────────────────────────────────────────────────────────────
// CREAR USUARIO POR DEFECTO (primer inicio)
// ────────────────────────────────────────────────────────────

function createDefaultUsers() {
  try {
    const db = getDb();
    const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
    
    if (existingUsers.count === 0) {
      console.log('\n📦 Creando usuarios por defecto...');
      
      // Veterinario por defecto
      const vet = registerUser({
        name: 'Dr. Carlos Mendoza',
        email: 'vet@clinica.com',
        password: '123456',
        role: 'veterinario',
        specialty: 'Medicina General',
        license: 'MV-12345',
      });

      // Dueño por defecto
      const owner = registerUser({
        name: 'Pedro Rodríguez',
        email: 'pedro@email.com',
        password: '123456',
        role: 'dueno',
      });

      // Verificar emails automáticamente
      verifyEmail(vet.verificationToken);
      verifyEmail(owner.verificationToken);

      console.log('✅ Usuarios creados:');
      console.log(`   🧑‍⚕️ Veterinario: vet@clinica.com / 123456`);
      console.log(`   👤 Dueño:       pedro@email.com / 123456`);
    }
  } catch (error) {
    console.error('Error al crear usuarios por defecto:', error.message);
  }
}

// ────────────────────────────────────────────────────────────
// INICIO DEL SERVIDOR
// ────────────────────────────────────────────────────────────

async function startServer() {
  // Crear usuarios por defecto si es la primera vez
  createDefaultUsers();

  app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log('  🐾 VetClinic API Server');
  console.log(`${'='.repeat(50)}`);
  console.log(`  Puerto:     ${PORT}`);
  console.log(`  Base datos: SQLite (data/vetclinic.db)`);
  console.log(`  CORS:       http://localhost:5173`);
  console.log(`${'='.repeat(50)}\n`);

  console.log('  Endpoints principales:');
  console.log(`  POST /api/auth/register     - Registro`);
  console.log(`  POST /api/auth/login        - Inicio sesión`);
  console.log(`  POST /api/auth/verify       - Verificar email`);
  console.log(`  POST /api/auth/resend       - Reenviar token`);
  console.log(`  GET  /api/users             - Lista usuarios`);
  console.log(`  GET  /api/pets              - Lista mascotas`);
  console.log(`  POST /api/pets              - Crear mascota`);
  console.log(`  GET  /api/appointments      - Lista citas`);
  console.log(`  POST /api/appointments      - Crear cita`);
  console.log(`  GET  /api/clinical-records  - Lista expedientes`);
  console.log(`  POST /api/clinical-records  - Crear expediente`);
  console.log(`  GET  /api/dashboard/stats   - Estadísticas`);
  console.log(`${'='.repeat(50)}\n`);
});
}

startServer();
