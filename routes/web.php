<?php

// ============================================================
// RUTAS WEB
// ============================================================
// Las rutas web no requieren token (usan sesión del navegador)
// El dashboard valida el token desde JavaScript (localStorage)
// ============================================================

use App\Models\Cita;
use App\Models\Documento;
use App\Models\Mascota;
use App\Models\Notificacion;
use App\Models\RegistroClinico;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Route;


// ============================================================
// RAIZ
// ============================================================
Route::get('/', function () {
    return view('login');
});

// ============================================================
// LOGIN — Mostrar formulario
// ============================================================
Route::get('/login', function () {
    return view('login');
})->name('login');

// ============================================================
// REGISTRO — Mostrar formulario
// ============================================================
Route::get('/registro', function () {
    return view('registro');
});

// ============================================================
// REGISTRO — Procesar creación de cuenta
// ============================================================
Route::post('/registro', function (Request $request) {
    $validated = $request->validate([
        'nombre'     => 'required|string|max:100',
        'email'      => 'required|email|unique:usuarios,email',
        'password'   => 'required|string|min:6|confirmed',
    ]);

    // Asignar rol 'cliente' por defecto
    $rolCliente = Rol::where('nombre', 'cliente')->firstOrFail();

    $user = Usuario::create([
        'nombre'   => $validated['nombre'],
        'email'    => $validated['email'],
        'password' => Hash::make($validated['password']),
        'rol_id'   => $rolCliente->id,
    ]);

    Auth::login($user);
    $request->session()->regenerate();

    return redirect('/dashboard');
});

// ============================================================
// LOGIN — Procesar inicio de sesión
// ============================================================
Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email'    => 'required|email',
        'password' => 'required',
    ]);

    $user = Usuario::where('email', $request->email)->first();

    if ($user && Hash::check($request->password, $user->password)) {
        Auth::login($user);
        $request->session()->regenerate();

        $rol = $user->rol->nombre;
        $redirect = in_array($rol, ['veterinario', 'admin'])
            ? '/veterinario/dashboard'
            : '/dashboard';

        return redirect()->intended($redirect);
    }

    return back()->withErrors([
        'email' => 'Credenciales inválidas.',
    ])->onlyInput('email');
});

// ============================================================
// ADMIN — Gestión de usuarios (solo admin)
// ============================================================
Route::get('/admin/usuarios', function () {
    $usuarios = Usuario::with('rol')->orderBy('created_at', 'desc')->paginate(20);
    $roles = Rol::all();
    return view('admin.usuarios', compact('usuarios', 'roles'));
})->middleware('role:admin');

// ============================================================
// ADMIN — Actualizar rol de un usuario
// ============================================================
Route::post('/admin/usuarios/{id}/rol', function (Request $request, int $id) {
    $validated = $request->validate([
        'rol_id' => 'required|exists:roles,id',
    ]);

    $usuario = Usuario::findOrFail($id);
    
    // Evitar que un admin se quite sus propios permisos
    if ($usuario->id === Auth::id()) {
        return back()->withErrors(['rol' => 'No puedes cambiarte el rol a ti mismo.']);
    }

    $usuario->update(['rol_id' => $validated['rol_id']]);

    return redirect('/admin/usuarios')->with('status', "Rol de {$usuario->nombre} actualizado.");
})->middleware('role:admin');

// ============================================================
// ADMIN — Ver Audit Logs
// ============================================================
Route::get('/admin/audit-logs', function () {
    $logs = App\Models\AuditLog::with('usuario')
        ->orderBy('created_at', 'desc')
        ->paginate(30);

    $anomalias = App\Models\AuditLog::where('severidad', 'ALTA')
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get();

    return view('admin.audit-logs', compact('logs', 'anomalias'));
})->middleware('role:admin');

// ============================================================
// ADMIN — Eliminar usuario
// ============================================================
Route::delete('/admin/usuarios/{id}', function (int $id) {
    $usuario = Usuario::findOrFail($id);

    // Evitar que un admin se elimine a sí mismo
    if ($usuario->id === Auth::id()) {
        return back()->withErrors(['error' => 'No puedes eliminarte a ti mismo.']);
    }

    $nombre = $usuario->nombre;
    $usuario->delete();

    return redirect('/admin/usuarios')->with('status', "Usuario «{$nombre}» eliminado.");
})->middleware('role:admin');

// ============================================================
// LOGOUT — Cerrar sesión
// ============================================================
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/login');
})->name('logout');

// ============================================================
// NOTIFICACIONES — Listar
// ============================================================
Route::get('/notificaciones', function () {
    $notificaciones = Notificacion::where('usuario_id', Auth::id())
        ->orderBy('created_at', 'desc')
        ->paginate(20);

    return view('notificaciones.index', compact('notificaciones'));
})->middleware('auth');

// ============================================================
// NOTIFICACIONES — Marcar una como leída
// ============================================================
Route::post('/notificaciones/{id}/leer', function (int $id) {
    $notif = Notificacion::where('id', $id)
        ->where('usuario_id', Auth::id())
        ->firstOrFail();

    $notif->update(['leido' => true]);

    return back();
})->middleware('auth');

// ============================================================
// NOTIFICACIONES — Marcar todas como leídas
// ============================================================
Route::post('/notificaciones/leer-todas', function () {
    Notificacion::where('usuario_id', Auth::id())
        ->where('leido', false)
        ->update(['leido' => true]);

    return back()->with('status', 'Todas las notificaciones marcadas como leídas.');
})->middleware('auth');

// ============================================================
// NOTIFICACIONES — Contar no leídas (para el badge)
// ============================================================
Route::get('/notificaciones/contar', function () {
    return response()->json([
        'no_leidas' => Notificacion::noLeidas(Auth::id()),
    ]);
})->middleware('auth');

// ============================================================
// DASHBOARD — Redirigir según rol
// ============================================================
Route::get('/dashboard', function () {
    $rol = Auth::user()->rol->nombre;

    if (in_array($rol, ['veterinario', 'admin'])) {
        return redirect('/veterinario/dashboard');
    }

    $mascotas = Mascota::where('usuario_id', Auth::id())
        ->withCount('registrosClinicos')
        ->orderBy('created_at', 'desc')
        ->get();

    return view('dashboard', compact('mascotas'));
})->middleware('auth');

// ============================================================
// MASCOTAS — Mostrar formulario de registro
// ============================================================
Route::get('/mascotas/registrar', function () {
    return view('mascotas.create');
})->middleware('auth');

// ============================================================
// MASCOTAS — Procesar registro
// ============================================================
Route::post('/mascotas/registrar', function (Request $request) {
    $validated = $request->validate([
        'nombre'  => 'required|string|max:100',
        'especie' => 'required|string|max:50',
        'raza'    => 'nullable|string|max:100',
        'edad'    => 'nullable|integer|min:0|max:50',
        'peso'    => 'nullable|numeric|min:0|max:500',
    ]);

    $mascota = Mascota::create([
        'nombre'     => $validated['nombre'],
        'especie'    => $validated['especie'],
        'raza'       => $validated['raza'],
        'edad'       => $validated['edad'],
        'peso'       => $validated['peso'],
        'usuario_id' => Auth::id(),
    ]);

    return redirect('/dashboard')->with('status', "¡{$mascota->nombre} registrada con éxito!");
})->middleware('auth');

// ============================================================
// CITAS — Listado y formulario
// ============================================================
Route::get('/citas', function () {
    $citas = Cita::where('usuario_id', Auth::id())
        ->with(['mascota', 'veterinario'])
        ->orderBy('fecha', 'desc')
        ->orderBy('hora', 'desc')
        ->get();

    $mascotas = Mascota::where('usuario_id', Auth::id())->get();

    return view('citas.index', compact('citas', 'mascotas'));
})->middleware('auth');

// ============================================================
// CITAS — Agendar nueva cita
// ============================================================
Route::post('/citas', function (Request $request) {
    $validated = $request->validate([
        'mascota_id' => 'required|exists:mascotas,id',
        'fecha'      => 'required|date|after_or_equal:today',
        'hora'       => 'required|date_format:H:i',
        'motivo'     => 'required|string|max:255',
    ]);

    $mascota = Mascota::findOrFail($validated['mascota_id']);

    if ($mascota->usuario_id !== Auth::id()) {
        abort(403, 'Esta mascota no te pertenece.');
    }

    $cita = Cita::create([
        'mascota_id' => $validated['mascota_id'],
        'usuario_id' => Auth::id(),
        'fecha'      => $validated['fecha'],
        'hora'       => $validated['hora'],
        'motivo'     => $validated['motivo'],
        'estado'     => 'programada',
    ]);

    // 🔔 Notificar al cliente
    Notificacion::crear(
        Auth::id(),
        'cita',
        "Cita agendada para {$mascota->nombre}",
        "El {$validated['fecha']} a las {$validated['hora']} - Motivo: {$validated['motivo']}",
        '/citas'
    );

    // 🔔 Notificar a todos los veterinarios (si no hay uno asignado)
    $veterinarios = Usuario::whereHas('rol', fn($q) => $q->where('nombre', 'veterinario'))->get();
    foreach ($veterinarios as $vet) {
        Notificacion::crear(
            $vet->id,
            'cita',
            "Nueva cita: {$mascota->nombre}",
            "Cliente: " . Auth::user()->nombre . " - {$validated['fecha']} a las {$validated['hora']}",
            '/veterinario/dashboard'
        );
    }

    return redirect('/citas')->with('status', 'Cita agendada con éxito.');
})->middleware('auth');

// ============================================================
// CITAS — Cancelar cita
// ============================================================
Route::post('/citas/{id}/cancelar', function (int $id) {
    $cita = Cita::findOrFail($id);

    if ($cita->usuario_id !== Auth::id()) {
        abort(403, 'No puedes cancelar una cita que no te pertenece.');
    }

    $cita->update(['estado' => 'cancelada']);

    // 🔔 Notificar al cliente
    Notificacion::crear(
        Auth::id(),
        'cita',
        "Cita cancelada",
        "Cita del {$cita->fecha} a las {$cita->hora} para {$cita->mascota->nombre} fue cancelada.",
        '/citas'
    );

    return redirect('/citas')->with('status', 'Cita cancelada.');
})->middleware('auth');

// ============================================================
// EXPEDIENTES — Redirigir a /historial (compatibilidad)
// ============================================================
Route::get('/expedientes', function () {
    return redirect('/historial');
})->middleware('auth');

// ============================================================
// HISTORIAL CLÍNICO — Listado de registros del usuario
// ============================================================
Route::get('/historial', function () {
    $registros = RegistroClinico::whereHas('mascota', function ($q) {
        $q->where('usuario_id', Auth::id());
    })
        ->with(['mascota', 'veterinario'])
        ->orderBy('fecha', 'desc')
        ->get();

    $mascotas = Mascota::where('usuario_id', Auth::id())->get();

    $documentos = Documento::whereHas('mascota', function ($q) {
        $q->where('usuario_id', Auth::id());
    })
        ->with(['mascota', 'registroClinico'])
        ->orderBy('created_at', 'desc')
        ->get();

    return view('historial.index', compact('registros', 'documentos', 'mascotas'));
})->middleware('auth');

// ============================================================
// DOCUMENTOS — Subir PDF
// ============================================================
Route::post('/documentos/subir', function (Request $request) {
    $validated = $request->validate([
        'mascota_id' => 'required|exists:mascotas,id',
        'archivo'    => 'required|file|mimes:pdf|max:10240',
    ]);

    $mascota = Mascota::findOrFail($validated['mascota_id']);

    if ($mascota->usuario_id !== Auth::id()) {
        abort(403, 'Esta mascota no te pertenece.');
    }

    $file = $request->file('archivo');
    $nombreOriginal = $file->getClientOriginalName();
    $nombreArchivo = time() . '_' . $nombreOriginal;
    $ruta = $file->storeAs('documentos', $nombreArchivo, 'public');

    Documento::create([
        'mascota_id'      => $validated['mascota_id'],
        'usuario_id'      => Auth::id(),
        'nombre_original' => $nombreOriginal,
        'nombre_archivo'  => $nombreArchivo,
        'ruta'            => $ruta,
        'tipo'            => 'pdf',
        'tamaño'          => round($file->getSize() / 1024),
    ]);

    return back()->with('status', "PDF «{$nombreOriginal}» subido con éxito.");
})->middleware('auth');

// ============================================================
// DOCUMENTOS — Descargar / Ver PDF
// ============================================================
Route::get('/documentos/{id}/descargar', function (int $id) {
    $doc = Documento::findOrFail($id);

    if ($doc->mascota->usuario_id !== Auth::id()) {
        $rol = Auth::user()->rol->nombre;
        if (!in_array($rol, ['veterinario', 'admin'])) {
            abort(403);
        }
    }

    $path = storage_path('app/public/' . $doc->ruta);

    if (!file_exists($path)) {
        abort(404, 'Archivo no encontrado.');
    }

    return response()->file($path, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'inline; filename="' . $doc->nombre_original . '"',
    ]);
})->middleware('auth');

// ============================================================
// VETERINARIO — Panel principal (citas programadas)
// ============================================================
Route::get('/veterinario/dashboard', function () {
    $citas = Cita::where('estado', 'programada')
        ->with(['mascota', 'mascota.usuario', 'usuario'])
        ->orderBy('fecha', 'asc')
        ->orderBy('hora', 'asc')
        ->get();

    return view('veterinario.dashboard', compact('citas'));
})->middleware('role:veterinario,admin');

// ============================================================
// VETERINARIO — Atender cita (guardar historial + completar)
// ============================================================
Route::post('/citas/{id}/atender', function (Request $request, int $id) {
    $cita = Cita::with('mascota')->findOrFail($id);

    if ($cita->estado !== 'programada') {
        return back()->withErrors(['cita' => 'Esta cita ya fue atendida o cancelada.']);
    }

    $validated = $request->validate([
        'diagnostico'  => 'nullable|string|max:1000',
        'tratamiento'  => 'nullable|string|max:1000',
        'observaciones' => 'nullable|string|max:1000',
    ]);

    RegistroClinico::create([
        'mascota_id'     => $cita->mascota_id,
        'veterinario_id' => Auth::id(),
        'fecha'          => now()->toDateString(),
        'tipo'           => 'consulta',
        'diagnostico'    => $validated['diagnostico'],
        'tratamiento'    => $validated['tratamiento'],
        'observaciones'  => $validated['observaciones'],
    ]);

    $cita->update(['estado' => 'completada']);

    // 🔔 Notificar al dueño de la mascota
    $dueno = $cita->mascota->dueno;
    if ($dueno) {
        $tieneVacuna = str_contains(strtolower($validated['diagnostico'] ?? ''), 'vacuna')
            || str_contains(strtolower($validated['tratamiento'] ?? ''), 'vacuna');

        Notificacion::crear(
            $dueno->id,
            $tieneVacuna ? 'vacunacion' : 'cita',
            $tieneVacuna
                ? "💉 Vacunación registrada para {$cita->mascota->nombre}"
                : "✅ Cita completada para {$cita->mascota->nombre}",
            $tieneVacuna
                ? "Se registró una vacunación. Diagnóstico: " . ($validated['diagnostico'] ?? 'N/A')
                : "La cita del {$cita->fecha} fue atendida. Revisa el historial clínico.",
            '/historial'
        );
    }

    return redirect('/veterinario/dashboard')
        ->with('status', 'Cita atendida. Historial clínico registrado.');
})->middleware('role:veterinario,admin');

// ============================================================
// OLVIDÉ CONTRASEÑA — Solicitar enlace
// ============================================================
Route::get('/olvide-contrasena', function () {
    return view('auth.forgot-password');
})->middleware('guest');

Route::post('/olvide-contrasena', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink($request->only('email'));

    return $status === Password::RESET_LINK_SENT
        ? back()->with(['status' => __($status)])
        : back()->withErrors(['email' => __($status)]);
})->middleware('guest');

// ============================================================
// RESTABLECER CONTRASEÑA — Mostrar formulario con token
// ============================================================
Route::get('/restablecer-contrasena/{token}', function (string $token) {
    return view('auth.reset-password', ['token' => $token]);
})->middleware('guest')->name('password.reset');

Route::post('/restablecer-contrasena', function (Request $request) {
    $request->validate([
        'token'    => 'required',
        'email'    => 'required|email',
        'password' => 'required|string|min:6|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill(['password' => Hash::make($password)])->save();
        }
    );

    return $status === Password::PASSWORD_RESET
        ? redirect('/login')->with('status', __($status))
        : back()->withErrors(['email' => [__($status)]]);
})->middleware('guest');