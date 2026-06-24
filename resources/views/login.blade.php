<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VetClinic - Iniciar Sesión</title>
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
            width: 380px;
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
        .form-group input {
            width: 100%;
            padding: 12px 14px;
            border: 2px solid #e0e8e4;
            border-radius: 10px;
            font-size: 14px;
            transition: border-color 0.3s, box-shadow 0.3s;
            outline: none;
        }
        .form-group input:focus {
            border-color: #00A86B;
            box-shadow: 0 0 0 4px rgba(0,168,107,0.1);
        }
        .form-group input.is-invalid {
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
        <p class="subtitle">Accede a tu panel de mascotas</p>

        @if ($errors->any())
            <div class="error-feedback">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        @if (session('status'))
            <div class="error-feedback" style="background:#def2e6; color:#1a7a4a; border-color:#b8e6c8;">
                {{ session('status') }}
            </div>
        @endif

        <form method="POST" action="{{ url('/login') }}">
            @csrf

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
                    autofocus
                >
            </div>

            <div class="form-group">
                <label for="password">Contraseña</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Ingresa tu contraseña"
                    class="@error('password') is-invalid @enderror"
                    required
                >
            </div>

            <button type="submit" class="btn">Iniciar Sesión</button>
        </form>

        <div style="text-align:center; margin-top:14px;">
            <a href="{{ url('/olvide-contrasena') }}" style="color:#6b7770; font-size:13px; text-decoration:none;">¿Olvidaste tu contraseña?</a>
        </div>

        <div class="register-link">
            ¿No tienes cuenta? <a href="{{ url('/registro') }}">Regístrate aquí</a>
        </div>
    </div>

</body>
</html>
