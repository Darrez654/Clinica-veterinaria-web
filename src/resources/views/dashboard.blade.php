<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VetClinic - Portal</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
body { display: flex; height: 100vh; background-color: #f8fafc; color: #334155; }
/* Sidebar */
.sidebar { width: 260px; background: white; border-right: 1px solid #e2e8f0; padding: 20px; display: flex; flex-direction: column; flex-shrink: 0; }
.logo { font-weight: bold; font-size: 20px; color: #f97316; margin-bottom: 40px; display: flex; align-items: center; gap: 8px; }
.nav-item { padding: 12px; margin-bottom: 5px; cursor: pointer; border-radius: 8px; color: #64748b; font-weight: 500; transition: all 0.2s; }
.nav-item:hover { background-color: #fff7ed; color: #f97316; }
.nav-item.active { background-color: #f97316; color: white; }
.nav-item.logout { margin-top: auto; color: #ef4444; }
.nav-item.logout:hover { background-color: #fef2f2; }
/* Main Content */
.main-content { flex: 1; padding: 20px; overflow-y: auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.user-profile { font-weight: 600; color: #1e293b; }
.user-profile small { font-weight: normal; color: #94a3b8; font-size: 12px; display: block; }
/* Dashboard Grid */
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px; }
.card h3 { margin-bottom: 15px; color: #1e293b; font-size: 16px; display: flex; justify-content: space-between; align-items: center; }
.pet-card { display: flex; align-items: center; gap: 15px; }
.pet-avatar { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: white; flex-shrink: 0; }
.pet-info h3 { margin-bottom: 2px; font-size: 16px; }
.pet-info p { color: #64748b; font-size: 13px; margin-bottom: 8px; }
.btn-small { padding: 6px 12px; font-size: 12px; border-radius: 6px; border: none; cursor: pointer; background: #e2e8f0; color: #475569; font-weight: 500; transition: background 0.2s; }
.btn-small:hover { background: #cbd5e1; }
.btn-primary { padding: 6px 12px; font-size: 12px; border-radius: 6px; border: none; cursor: pointer; background: #f97316; color: white; font-weight: 500; transition: background 0.2s; }
.btn-primary:hover { background: #ea580c; }
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
tr:last-child td { border-bottom: none; }
.status-pill { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; display: inline-block; }
.status-completada { background: #dcfce7; color: #166534; }
.status-programada { background: #dbeafe; color: #1e40af; }
.status-cancelada { background: #fee2e2; color: #991b1b; }
.empty-state { text-align: center; padding: 30px; color: #94a3b8; }
.empty-state p { margin-top: 8px; font-size: 14px; }
/* Modal */
.modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 1000; }
.modal-overlay.active { display: flex; }
.modal { background: white; padding: 30px; border-radius: 12px; width: 450px; max-width: 90%; max-height: 90vh; overflow-y: auto; }
.modal h2 { margin-bottom: 20px; color: #1e293b; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-size: 13px; font-weight: 600; color: #475569; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #f97316; outline: none; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
.form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.btn-cancel { padding: 10px 20px; background: #e2e8f0; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; }
.btn-save { padding: 10px 20px; background: #f97316; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; }
.btn-save:hover { background: #ea580c; }
.loading { text-align: center; padding: 40px; color: #94a3b8; }
.spinner { width: 30px; height: 30px; border: 3px solid #e2e8f0; border-top: 3px solid #f97316; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 10px; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>
<!-- Sidebar -->
<div class="sidebar">
<div class="logo">🐾 VetClinic</div>
<div class="nav-item active" data-section="mascotas">Mis Mascotas</div>
<div class="nav-item" data-section="registrar">Registrar Mascota</div>
<div class="nav-item" data-section="citas">Mis Citas</div>
<div class="nav-item" data-section="expedientes">Expedientes</div>
<div class="nav-item logout" id="btnLogout">Cerrar Sesión</div>
</div>

<!-- Main Content -->
<div class="main-content">
<div class="header">
<h1 id="pageTitle">Mis Mascotas</h1>
<div class="user-profile" id="userInfo">
Cargando...
<small></small>
</div>
</div>

<!-- Content Area -->
<div id="contentArea">
<div class="loading"><div class="spinner"></div><p>Cargando datos...</p></div>
</div>
</div>

<!-- Modal para registrar mascota -->
<div class="modal-overlay" id="modalMascota">
<div class="modal">
<h2>Registrar Mascota</h2>
<form id="formMascota">
<div class="form-group">
<label>Nombre *</label>
<input type="text" name="nombre" required>
</div>
<div class="form-group">
<label>Especie *</label>
<select name="especie" required>
<option value="">Seleccionar...</option>
<option value="Perro">Perro</option>
<option value="Gato">Gato</option>
<option value="Ave">Ave</option>
<option value="Roedor">Roedor</option>
<option value="Reptil">Reptil</option>
<option value="Otro">Otro</option>
</select>
</div>
<div class="form-group">
<label>Raza</label>
<input type="text" name="raza">
</div>
<div class="form-group">
<label>Edad (años)</label>
<input type="number" name="edad" min="0" max="50">
</div>
<div class="form-group">
<label>Peso (kg)</label>
<input type="number" name="peso" step="0.01" min="0">
</div>
<div class="form-group">
<label>Color</label>
<input type="text" name="color">
</div>
<div class="form-actions">
<button type="button" class="btn-cancel" onclick="cerrarModal()">Cancelar</button>
<button type="submit" class="btn-save">Guardar</button>
</div>
</form>
</div>
</div>

<script>
// ============================================
// CONFIGURACIÓN
// ============================================
const API_URL = '/api/v1';
const COLORS = ['#f97316', '#8b5cf6', '#06b6d4', '#10b981', '#ef4444', '#f59e0b'];

function getToken() { return localStorage.getItem('auth_token'); }
function getUsuario() { return JSON.parse(localStorage.getItem('usuario') || '{}'); }

function apiFetch(endpoint, options = {}) {
    const token = getToken();
    return fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    }).then(res => {
        if (res.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
            throw new Error('Sesión expirada');
        }
        return res.json();
    });
}

// ============================================
// VERIFICAR AUTENTICACIÓN
// ============================================
if (!getToken()) {
    window.location.href = '/login';
}

// ============================================
// INFORMACIÓN DEL USUARIO
// ============================================
function cargarUsuario() {
    const usuario = getUsuario();
    const el = document.getElementById('userInfo');
    if (usuario.nombre) {
        el.innerHTML = `${usuario.nombre} <small>${usuario.rol?.nombre || ''}</small>`;
    } else {
        apiFetch('/perfil').then(data => {
            if (data.status === 'success') {
                localStorage.setItem('usuario', JSON.stringify(data.data.usuario));
                el.innerHTML = `${data.data.usuario.nombre} <small>${data.data.usuario.rol?.nombre || ''}</small>`;
            }
        });
    }
}

// ============================================
// NAVEGACIÓN POR SECCIONES
// ============================================
document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        this.classList.add('active');
        const section = this.dataset.section;
        document.getElementById('pageTitle').textContent = this.textContent.trim();
        if (section === 'mascotas') cargarMascotas();
        else if (section === 'registrar') abrirModal();
        else if (section === 'citas') cargarCitas();
        else if (section === 'expedientes') cargarExpedientes();
    });
});

// ============================================
// SECCIÓN: MIS MASCOTAS
// ============================================
function cargarMascotas() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando mascotas...</p></div>';

    apiFetch('/mascotas').then(data => {
        if (data.status === 'success' && data.data.length > 0) {
            const mascotas = data.data;
            let html = '<div class="grid">';
            mascotas.forEach((m, i) => {
                const color = COLORS[i % COLORS.length];
                const inicial = m.nombre.charAt(0).toUpperCase();
                html += `
                <div class="card pet-card">
                    <div class="pet-avatar" style="background: ${color}">${inicial}</div>
                    <div class="pet-info">
                        <h3>${m.nombre}</h3>
                        <p>${m.especie} ${m.raza ? '- ' + m.raza : ''} ${m.edad ? '· ' + m.edad + ' años' : ''}</p>
                        <button class="btn-small" onclick="verExpediente(${m.id})">Ver expediente</button>
                    </div>
                </div>`;
            });
            html += '</div>';

            // Resumen de citas próximas
            html += '<div class="card"><h3>Resumen</h3>';
            const total = mascotas.length;
            const conRegistros = mascotas.filter(m => m.registros_clinicos?.length > 0).length;
            html += `<p style="color: #64748b; font-size: 14px;">Tienes <strong>${total}</strong> mascota${total !== 1 ? 's' : ''} registrada${total !== 1 ? 's' : ''} · <strong>${conRegistros}</strong> con expediente clínico</p>`;
            html += '</div>';

            area.innerHTML = html;
        } else {
            area.innerHTML = `
            <div class="card empty-state">
                <p style="font-size: 40px;">🐾</p>
                <p>Aún no tienes mascotas registradas</p>
                <button class="btn-primary" style="margin-top: 15px; padding: 10px 20px; font-size: 14px;" onclick="abrirModal()">Registrar mi primera mascota</button>
            </div>`;
        }
    });
}

// ============================================
// SECCIÓN: CITAS
// ============================================
function cargarCitas() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando citas...</p></div>';

    apiFetch('/citas').then(data => {
        if (data.status === 'success' && data.data.length > 0) {
            let html = '<div class="card"><h3>Mis Citas</h3><table>';
            data.data.forEach(c => {
                const statusClass = c.estado === 'completada' ? 'status-completada' :
                                    c.estado === 'cancelada' ? 'status-cancelada' : 'status-programada';
                html += `<tr>
                    <td>${c.fecha} ${c.hora}</td>
                    <td>${c.mascota?.nombre || 'Mascota'} - ${c.motivo}</td>
                    <td><span class="status-pill ${statusClass}">${c.estado}</span></td>
                </tr>`;
            });
            html += '</table></div>';
            area.innerHTML = html;
        } else {
            area.innerHTML = `
            <div class="card empty-state">
                <p style="font-size: 40px;">📅</p>
                <p>No tienes citas agendadas</p>
            </div>`;
        }
    });
}

// ============================================
// SECCIÓN: EXPEDIENTES
// ============================================
function cargarExpedientes() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando expedientes...</p></div>';

    apiFetch('/registros-clinicos').then(data => {
        if (data.status === 'success' && data.data.length > 0) {
            let html = '<div class="card"><h3>Expedientes Clínicos</h3><table>';
            data.data.forEach(r => {
                html += `<tr>
                    <td><strong>${r.mascota?.nombre || 'Mascota'}</strong></td>
                    <td>${r.tipo}</td>
                    <td>${r.fecha}</td>
                    <td>${r.veterinario?.nombre || '—'}</td>
                </tr>`;
            });
            html += '</table></div>';
            area.innerHTML = html;
        } else {
            area.innerHTML = `
            <div class="card empty-state">
                <p style="font-size: 40px;">📋</p>
                <p>No hay expedientes clínicos aún</p>
            </div>`;
        }
    });
}

// ============================================
// VER EXPEDIENTE DE MASCOTA
// ============================================
function verExpediente(id) {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando expediente...</p></div>';

    apiFetch(`/mascotas/${id}`).then(data => {
        if (data.status === 'success') {
            const m = data.data;
            const color = COLORS[0];
            const inicial = m.nombre.charAt(0).toUpperCase();

            let html = `
            <button class="btn-small" onclick="cargarMascotas()" style="margin-bottom: 15px;">← Volver</button>
            <div class="card pet-card" style="margin-bottom: 20px;">
                <div class="pet-avatar" style="background: ${color}">${inicial}</div>
                <div class="pet-info">
                    <h3>${m.nombre}</h3>
                    <p>${m.especie} ${m.raza ? '- ' + m.raza : ''} · ${m.edad ? m.edad + ' años' : 'Edad desconocida'} · ${m.peso ? m.peso + ' kg' : 'Peso desconocido'}</p>
                    <p style="color: #94a3b8; font-size: 12px;">${m.color ? 'Color: ' + m.color : ''}</p>
                </div>
            </div>`;

            // Registros clínicos
            html += '<div class="card"><h3>Expedientes Clínicos</h3>';
            if (m.registros_clinicos && m.registros_clinicos.length > 0) {
                html += '<table>';
                m.registros_clinicos.forEach(r => {
                    html += `<tr>
                        <td><strong>${r.fecha}</strong></td>
                        <td>${r.tipo}</td>
                        <td>${r.diagnostico || '—'}</td>
                        <td>${r.veterinario?.nombre || '—'}</td>
                    </tr>`;
                });
                html += '</table>';
            } else {
                html += '<p style="color: #94a3b8;">Sin registros clínicos</p>';
            }
            html += '</div>';

            // Citas
            html += '<div class="card"><h3>Citas</h3>';
            if (m.citas && m.citas.length > 0) {
                html += '<table>';
                m.citas.forEach(c => {
                    const statusClass = c.estado === 'completada' ? 'status-completada' :
                                        c.estado === 'cancelada' ? 'status-cancelada' : 'status-programada';
                    html += `<tr>
                        <td>${c.fecha} ${c.hora}</td>
                        <td>${c.motivo}</td>
                        <td><span class="status-pill ${statusClass}">${c.estado}</span></td>
                    </tr>`;
                });
                html += '</table>';
            } else {
                html += '<p style="color: #94a3b8;">Sin citas registradas</p>';
            }
            html += '</div>';

            area.innerHTML = html;
            document.getElementById('pageTitle').textContent = `Expediente: ${m.nombre}`;
        }
    });
}

// ============================================
// MODAL: REGISTRAR MASCOTA
// ============================================
function abrirModal() {
    document.getElementById('modalMascota').classList.add('active');
}

function cerrarModal() {
    document.getElementById('modalMascota').classList.remove('active');
    document.getElementById('formMascota').reset();
}

document.getElementById('formMascota').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    const btn = this.querySelector('.btn-save');
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    apiFetch('/mascotas', {
        method: 'POST',
        body: JSON.stringify(data),
    }).then(res => {
        if (res.status === 'success') {
            cerrarModal();
            cargarMascotas();
            document.querySelector('[data-section="mascotas"]').click();
        } else {
            alert(res.mensaje || 'Error al registrar');
        }
    }).finally(() => {
        btn.textContent = 'Guardar';
        btn.disabled = false;
    });
});

// ============================================
// CERRAR SESIÓN
// ============================================
document.getElementById('btnLogout').addEventListener('click', function() {
    apiFetch('/logout', { method: 'POST' }).finally(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    });
});

// ============================================
// INICIALIZAR
// ============================================
cargarUsuario();
cargarMascotas();
</script>
</body>
</html>
