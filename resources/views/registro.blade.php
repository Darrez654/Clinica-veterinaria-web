<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VetClinic - Crear Cuenta</title>
    <style>
        *  { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #f0f7f4 0%, #d4e8e2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .login-card {
            background: white;
            padding: 45px 40px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            width: 420px;
        }
        .login-card h2 {
            color: #00A86B;
            text-align: center;
            font-size: 28px;
            margin-bottom: 5px;
        }
        .login-card .subtitle {
            text-align: center;
            color: #6b7770;
            font-size: 14px;
            margin-bottom: 28px;
        }

        .form-group {
            margin-bottom: 18px;
        }
        .form-group label {
            display: block;
            margin-bottom: 6px;
            color: #1e2f25;
            font-size: 14px;
            font-weight: 600;
        }
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 12px 14px;
            border: 2px solid #e0e8e4;
            border-radius: 10px;
            font-size: 14px;
            transition: border-color 0.3s, box-shadow 0.3s;
            outline: none;
            background: white;
        }
        .form-group input:focus,
        .form-group select:focus {
            border-color: #00A86B;
            box-shadow: 0 0 0 4px rgba(0,168,107,0.1);
        }
        .form-group input.is-invalid,
        .form-group select.is-invalid {
            border-color: #dc3545;
        }

        .btn {
            width: 100%;
            padding: 13px;
            background: #00A86B;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.3s, transform 0.2s;
            margin-top: 5px;
        }
        .btn:hover {
            background: #008f5a;
            transform: translateY(-1px);
        }

        .error-feedback {
            background: #fde8e8;
            color: #b33a2e;
            padding: 12px 14px;
            border-radius: 10px;
            font-size: 13px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
        }
        .error-feedback ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .success-feedback {
            background: #def2e6;
            color: #1a7a4a;
            padding: 12px 14px;
            border-radius: 10px;
            font-size: 13px;
            margin-bottom: 20px;
            border: 1px solid #b8e6c8;
        }

        .register-link {
            text-align: center;
            margin-top: 22px;
            font-size: 14px;
            color: #6b7770;
        }
        .register-link a {
            color: #00A86B;
            text-decoration: none;
            font-weight: 600;
        }
        .register-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <div class="login-card">
        <h2>🐾 VetClinic</h2>
        <p class="subtitle">Crea tu cuenta gratuita</p>

        @if ($errors->any())
            <div class="error-feedback">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div style="background:#e8f4f0; color:#1a7a4a; padding:12px 14px; border-radius:10px; font-size:13px; margin-bottom:20px; border:1px solid #b8e6c8;">
            ✅ Se te asignará el rol de <strong>Dueño de mascota</strong> automáticamente.
        </div>

        <form method="POST" action="/registro">
            @csrf

            <div class="form-group">
                <label for="nombre">Nombre completo</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value="{{ old('nombre') }}"
                    placeholder="Ej: Juan Pérez"
                    class="@error('nombre') is-invalid @enderror"
                    required
                    autofocus
                >
            </div>

            <div class="form-group">
                <label for="email">Correo electrónico</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value="{{ old('email') }}"
                    placeholder="correo@ejemplo.com"
                    class="@error('email') is-invalid @enderror"
                    required
                >
            </div>

            <div class="form-group">
                <label for="password">Contraseña</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Mínimo 6 caracteres"
                    class="@error('password') is-invalid @enderror"
                    required
                >
            </div>

            <div class="form-group">
                <label for="password_confirmation">Confirmar contraseña</label>
                <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    placeholder="Repite tu contraseña"
                    required
                >
            </div>

            {{-- El rol se asigna automáticamente como 'cliente' --}}
            {{-- El administrador puede cambiarlo desde el panel de gestión --}}

            <button type="submit" class="btn">Crear Cuenta</button>
        </form>

        <div class="register-link">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
        </div>
    </div>

</body>
</html>
