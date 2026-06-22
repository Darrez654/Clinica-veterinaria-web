/**
 * Servidor API Mock para desarrollo
 * Compatible con Web, Neutralino y React Native
 *
 * Uso: node scripts/mock-api-server.js
 * Endpoint: http://localhost:3001/api
 */

const http = require('http');

const PORT = 3001;
const BASE_PATH = '/api';

const data = {
  users: [
    { id: 1, name: 'Carlos Pérez', email: 'carlos@email.com', phone: '+34 612 345 678', address: 'Calle Principal 123, Madrid', registrationDate: '2024-01-15', active: true },
    { id: 2, name: 'Ana Martínez', email: 'ana@email.com', phone: '+34 623 456 789', address: 'Avenida Central 45, Barcelona', registrationDate: '2024-02-20', active: true },
    { id: 3, name: 'Luis Ramírez', email: 'luis@email.com', phone: '+34 634 567 890', address: 'Plaza Mayor 7, Valencia', registrationDate: '2024-03-10', active: true },
  ],
  veterinarians: [
    { id: 1, name: 'Dra. María García', email: 'm.garcia@vetclinic.com', phone: '+34 611 222 333', specialty: 'Cirugía', license: 'VET-2018-001', yearsExperience: 6, active: true },
    { id: 2, name: 'Dr. José López', email: 'j.lopez@vetclinic.com', phone: '+34 622 333 444', specialty: 'Medicina Interna', license: 'VET-2015-042', yearsExperience: 9, active: true },
    { id: 3, name: 'Dra. Laura Rodríguez', email: 'l.rodriguez@vetclinic.com', phone: '+34 633 444 555', specialty: 'Dermatología', license: 'VET-2020-078', yearsExperience: 4, active: true },
  ],
  pets: [
    { id: 1, name: 'Max', species: 'Perro', breed: 'Golden Retriever', age: 3, weight: 28.5, owner: 'Carlos Pérez', registrationDate: '2024-01-20', color: 'Dorado' },
    { id: 2, name: 'Luna', species: 'Gato', breed: 'Siamés', age: 2, weight: 4.2, owner: 'Ana Martínez', registrationDate: '2024-02-15', color: 'Crema' },
    { id: 3, name: 'Toby', species: 'Perro', breed: 'Beagle', age: 5, weight: 12.8, owner: 'Luis Ramírez', registrationDate: '2024-03-05', color: 'Tricolor' },
  ],
  appointments: [
    { id: 1, date: '2024-05-26', time: '09:00', pet: 'Max', owner: 'Carlos Pérez', veterinarian: 'Dra. María García', reason: 'Vacunación anual', status: 'Programada' },
    { id: 2, date: '2024-05-26', time: '10:30', pet: 'Luna', owner: 'Ana Martínez', veterinarian: 'Dr. José López', reason: 'Consulta general', status: 'Programada' },
    { id: 3, date: '2024-05-26', time: '12:00', pet: 'Toby', owner: 'Luis Ramírez', veterinarian: 'Dra. María García', reason: 'Control de peso', status: 'Programada' },
  ],
  'clinical-records': [
    { id: 1, pet: 'Max', owner: 'Carlos Pérez', date: '2024-05-20', veterinarian: 'Dra. María García', diagnosis: 'Vacunación anual', treatment: 'Vacuna antirrábica', notes: 'Buena salud', medications: 'Vacuna antirrábica', weight: 28.5, temperature: 38.2 },
    { id: 2, pet: 'Luna', owner: 'Ana Martínez', date: '2024-05-18', veterinarian: 'Dr. José López', diagnosis: 'Dermatitis alérgica', treatment: 'Antihistamínico', notes: 'Mejoría gradual', medications: 'Crema cortisona 1%', weight: 4.2, temperature: 38.5 },
  ],
};

function sendJSON(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(body));
}

function parseURL(url) {
  const [path, queryString] = url.split('?');
  const params = {};
  if (queryString) {
    queryString.split('&').forEach(pair => {
      const [key, val] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(val || '');
    });
  }
  return { path: path.replace(BASE_PATH, ''), params };
}

const server = http.createServer((req, res) => {
  const { path, params } = parseURL(req.url);
  const method = req.method;

  // CORS
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  // Dashboard endpoints
  if (path === '/dashboard/stats' && method === 'GET') {
    return sendJSON(res, 200, {
      data: {
        totalUsers: 127,
        totalVeterinarians: 8,
        totalPets: 342,
        todayAppointments: 15,
        pendingAppointments: 8,
        completedToday: 7,
      },
      success: true,
    });
  }

  if (path === '/dashboard/recent-activity' && method === 'GET') {
    return sendJSON(res, 200, {
      data: [
        { id: 1, action: 'Nueva mascota registrada', detail: 'Rex - Pastor Alemán', time: 'Hace 15 min', type: 'pet' },
        { id: 2, action: 'Cita completada', detail: 'Luna - Vacunación', time: 'Hace 1 hora', type: 'appointment' },
        { id: 3, action: 'Expediente actualizado', detail: 'Max - Análisis de sangre', time: 'Hace 2 horas', type: 'record' },
      ],
      success: true,
    });
  }

  if (path === '/dashboard/upcoming' && method === 'GET') {
    return sendJSON(res, 200, {
      data: [
        { time: '09:00', pet: 'Max', owner: 'Carlos Pérez', vet: 'Dra. García' },
        { time: '10:30', pet: 'Luna', owner: 'Ana Martínez', vet: 'Dr. López' },
        { time: '12:00', pet: 'Toby', owner: 'Luis Ramírez', vet: 'Dra. García' },
      ],
      success: true,
    });
  }

  // CRUD endpoints genéricos
  const pathParts = path.split('/').filter(Boolean);
  const resource = pathParts[0];
  const resourceId = pathParts[1] ? parseInt(pathParts[1]) : null;

  if (data[resource]) {
    let collection = data[resource];

    if (method === 'GET') {
      if (resourceId) {
        const item = collection.find(i => i.id === resourceId);
        if (item) return sendJSON(res, 200, { data: item, success: true });
        return sendJSON(res, 404, { data: null, success: false, message: 'No encontrado' });
      }

      // Filtrar por parámetros de búsqueda
      if (params.q) {
        const query = params.q.toLowerCase();
        collection = collection.filter(item =>
          Object.values(item).some(val =>
            String(val).toLowerCase().includes(query)
          )
        );
      }

      return sendJSON(res, 200, { data: collection, success: true });
    }

    if (method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const newItem = JSON.parse(body);
          newItem.id = collection.length + 1;
          data[resource].push(newItem);
          sendJSON(res, 201, { data: newItem, success: true, message: 'Creado exitosamente' });
        } catch (e) {
          sendJSON(res, 400, { data: null, success: false, message: 'JSON inválido' });
        }
      });
      return;
    }
  }

  // 404 - Ruta no encontrada
  sendJSON(res, 404, { data: null, success: false, message: 'Endpoint no encontrado' });
});

server.listen(PORT, () => {
  console.log(`\n🔵 API Mock VetClinic corriendo en http://localhost:${PORT}${BASE_PATH}`);
  console.log(`📋 Endpoints disponibles:`);
  Object.keys(data).forEach(key => {
    console.log(`   GET    ${BASE_PATH}/${key}`);
    console.log(`   GET    ${BASE_PATH}/${key}/:id`);
    console.log(`   POST   ${BASE_PATH}/${key}`);
  });
  console.log(`   GET    ${BASE_PATH}/dashboard/stats`);
  console.log(`   GET    ${BASE_PATH}/dashboard/recent-activity`);
  console.log(`   GET    ${BASE_PATH}/dashboard/upcoming`);
  console.log(`\n✅ Presiona Ctrl+C para detener\n`);
});
