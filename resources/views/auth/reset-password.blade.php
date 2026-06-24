<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VetClinic - Restablecer Contraseña</title>
    <style>
        *  { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #f0f7f4 0%, #d4e8e2 100%);
            display: flex; justify-content: center; align-items: center; min-height: 100vh;
        }
        .login-card {
            background: white; padding: 45px 40px; border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08); width: 400px;
        }
        .login-card h2 { color: #00A86B; text-align: center; font-size: 26px; margin-bottom: 5px; }
        .login-card .subtitle { text-align: center; color: #6b7770; font-size: 14px; margin-bottom: 28px; }
        .form-group { margin-bottom: 18px; }
        .form-group label { display: block; margin-bottom: 6px; color: #1e2f25; font-size: 14px; font-weight: 600; }
        .form-group input {
            width: 100%; padding: 12px 14px; border: 2px solid #e0e8e4;
            border-radius: 10px; font-size: 14px; transition: border-color 0.3s, box-shadow 0.3s; outline: none;
        }
        .form-group input:focus { border-color: #00A86B; box-shadow: 0 0 0 4px rgba(0,168,107,0.1); }
        .form-group input.is-invalid { border-color: #dc3545; }
        .btn {
            width: 100%; padding: 13px; background: #00A86B; color: white; border: none;
            border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer;
            transition: background 0.3s, transform 0.2s; margin-top: 5px;
        }
        .btn:hover { background: #008f5a; transform: translateY(-1px); }
        .error-feedback {
            background: #fde8e8; color: #b33a2e; padding: 12px 14px; border-radius: 10px;
            font-size: 13px; margin-bottom: 20px; border: 1px solid #f5c6cb;
        }
        .error-feedback ul { list-style: none; margin: 0; padding: 0; }
        .register-link { text-align: center; margin-top: 22px; font-size: 14px; color: #6b7770; }
        .register-link a { color: #00A86B; text-decoration: none; font-weight: 600; }
        .register-link a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="login-card">
        <h2>🐾 VetClinic</h2>
        <p class="subtitle">Escribe tu nueva contraseña</p>

        @if ($errors->any())
            <div class="error-feedback">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ url('/restablecer-contrasena') }}">
            @csrf

            <input type="hidden" name="token" value="{{ $token }}">

            <div class="form-group">
                <label for="email">Correo electrónico</label>
                <input type="email" name="email" value="{{ $email ?? old('email') }}"
                    class="@error('email') is-invalid @enderror" required readonly>
            </div>

            <div class="form-group">
                <label for="password">Nueva contraseña</label>
                <input type="password" name="password" placeholder="Mínimo 6 caracteres"
                    class="@error('password') is-invalid @enderror" required autofocus>
            </div>

            <div class="form-group">
                <label for="password_confirmation">Confirmar contraseña</label>
                <input type="password" name="password_confirmation" placeholder="Repite tu contraseña" required>
            </div>

            <button type="submit" class="btn">Restablecer contraseña</button>
        </form>

        <div class="register-link"><a href="{{ url('/login') }}">← Volver al inicio de sesión</a></div>
    </div>
</body>
</html>
                </div>
                <button onclick="cerrarModalSubir()" style="
                    width:32px; height:32px; border-radius:8px; border:none;
                    background:#f0f4f2; cursor:pointer; font-size:16px;
                    display:flex; align-items:center; justify-content:center;
                ">✕</button>
            </div>


            <form method="POST" action="{{ url('/documentos/subir') }}" enctype="multipart/form-data">
                @csrf

                <div class="form-group" style="margin-bottom:18px;">
                    <label for="mascota_id_subir" style="display:block; font-size:13px; font-weight:600; color:#4a5751; margin-bottom:6px;">Mascota *</label>
                    <select name="mascota_id" id="mascota_id_subir" class="search-input" required>
                        <option value="">Seleccionar mascota...</option>
                        @foreach ($mascotas as $m)
                            <option value="{{ $m->id }}">{{ $m->nombre }} ({{ $m->especie }})</option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group" style="margin-bottom:18px;">
                    <label for="archivo" style="display:block; font-size:13px; font-weight:600; color:#4a5751; margin-bottom:6px;">Archivo PDF *</label>
                    <input type="file" name="archivo" id="archivo" accept=".pdf,application/pdf"
                        style="width:100%; padding:10px; border:2px solid #e0e8e4; border-radius:10px; font-size:14px;"
                        required>
                    <span style="font-size:12px; color:#6b7770; margin-top:4px; display:block;">Solo PDF · Máximo 10 MB</span>
                </div>

                <div style="display:flex; gap:12px; justify-content:flex-end;">
                    <button type="button" onclick="cerrarModalSubir()" style="
                        background:transparent; color:#6b7770; border:1px solid #dce3dc;
                        padding:10px 24px; border-radius:8px; font-size:14px; cursor:pointer;
                    ">Cancelar</button>
                    <button type="submit" style="
                        background:#00A86B; color:white; border:none;
                        padding:10px 24px; border-radius:8px; font-size:14px;
                        font-weight:600; cursor:pointer;
                    ">📤 Subir PDF</button>
                </div>
            </form>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    function abrirModalSubir() {
        document.getElementById('modalSubirPDF').style.display = 'flex';
    }
    function cerrarModalSubir() {
        document.getElementById('modalSubirPDF').style.display = 'none';
    }
    document.getElementById('modalSubirPDF').addEventListener('click', function(e) {
        if (e.target === this) cerrarModalSubir();
    });
</script>
@endpush
                @endforelse
            </div>
        </div>

        {{-- ============================================================
             COLUMNA DERECHA — FORMULARIO NUEVA CITA
             ============================================================ --}}
        <div>
            <div class="card" style="position:sticky; top:90px;">
                <h2 style="font-size:18px; margin-bottom:4px;">📅 Nueva Cita</h2>
                <p style="font-size:13px; color:#6b7770; margin-bottom:18px;">Selecciona mascota, fecha y motivo.</p>


                <form method="POST" action="{{ url('/citas') }}">
                    @csrf

                    <div class="form-group" style="margin-bottom:16px;">
                        <label for="mascota_id" style="display:block; font-size:13px; font-weight:600; color:#4a5751; margin-bottom:6px;">Mascota *</label>
                        <select name="mascota_id" id="mascota_id" class="search-input @error('mascota_id') is-invalid @enderror" required>
                            <option value="">Seleccionar mascota...</option>
                            @foreach ($mascotas as $mascota)
                                <option value="{{ $mascota->id }}" {{ old('mascota_id') == $mascota->id ? 'selected' : '' }}>
                                    {{ $mascota->nombre }} ({{ $mascota->especie }})
                                </option>
                            @endforeach
                        </select>
                        @error('mascota_id')
                            <span style="color:#b33a2e; font-size:12px;">{{ $message }}</span>
                        @enderror
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div class="form-group" style="margin-bottom:16px;">
                            <label for="fecha" style="display:block; font-size:13px; font-weight:600; color:#4a5751; margin-bottom:6px;">Fecha *</label>
                            <input type="date" name="fecha" id="fecha"
                                value="{{ old('fecha') }}"
                                class="search-input @error('fecha') is-invalid @enderror"
                                min="{{ date('Y-m-d') }}" required
                            >
                            @error('fecha')
                                <span style="color:#b33a2e; font-size:12px;">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group" style="margin-bottom:16px;">
                            <label for="hora" style="display:block; font-size:13px; font-weight:600; color:#4a5751; margin-bottom:6px;">Hora *</label>
                            <input type="time" name="hora" id="hora"
                                value="{{ old('hora') }}"
                                class="search-input @error('hora') is-invalid @enderror"
                                required
                            >
                            @error('hora')
                                <span style="color:#b33a2e; font-size:12px;">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom:20px;">
                        <label for="motivo" style="display:block; font-size:13px; font-weight:600; color:#4a5751; margin-bottom:6px;">Motivo *</label>
                        <textarea name="motivo" id="motivo" rows="3"
                            class="search-input @error('motivo') is-invalid @enderror"
                            placeholder="Ej: Vacunación, revisión general..."
                            required>{{ old('motivo') }}</textarea>
                        @error('motivo')
                            <span style="color:#b33a2e; font-size:12px;">{{ $message }}</span>
                        @enderror
                    </div>

                    <button type="submit" class="btn-new-appointment" style="
                        background:#00A86B; color:white; border:none;
                        padding:12px 24px; border-radius:10px; font-size:14px;
                        font-weight:bold; cursor:pointer; width:100%;
                        transition:background 0.2s;
                    ">📅 Agendar Cita</button>
                </form>
            </div>
        </div>

    </div>

    @if (session('status'))
        <div class="alert-bar" style="margin-top:20px; background:#def2e6; color:#1a7a4a; border-color:#b8e6c8;">
            {{ session('status') }}
        </div>
    @endif
@endsection
