@extends('layouts.app')

@section('title', 'VetClinic - Gestión de Usuarios')

@section('breadcrumbs', 'Admin > Usuarios')

@section('sidebar')
    @parent
    <li><a href="/admin/usuarios" class="menu-item active">👥 Gestionar Usuarios</a></li>
    <li><a href="/veterinario/dashboard" class="menu-item">📅 Citas Pendientes</a></li>
    <li><a href="/notificaciones" class="menu-item">🔔 Notificaciones</a></li>
    <li><a href="/dashboard" class="menu-item">🏠 Ir al Portal</a></li>
@endsection

@section('content')
    <div class="page-header-block">
        <div>
            <h1 class="page-title-sm">Gestión de Usuarios</h1>
            <p class="page-subtitle">Administra los roles y accesos de todos los usuarios del sistema.</p>
        </div>
        <span style="background:#00A86B; color:white; padding:8px 16px; border-radius:10px; font-size:14px; font-weight:600;">
            {{ $usuarios->total() }} usuario{{ $usuarios->total() !== 1 ? 's' : '' }}
        </span>
    </div>

    @if (session('status'))
        <div style="background:#def2e6; color:#1a7a4a; padding:12px 18px; border-radius:10px; margin-bottom:20px; border:1px solid #b8e6c8;">
            {{ session('status') }}
        </div>
    @endif

    @if ($errors->any())
        <div style="background:#fde8e8; color:#b33a2e; padding:12px 18px; border-radius:10px; margin-bottom:20px; border:1px solid #f5c6cb;">
            <ul style="list-style:none; margin:0; padding:0;">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="management-container">
        <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
                <thead>
                    <tr style="border-bottom:2px solid #eef2ee; text-align:left;">
                        <th style="padding:12px 16px; color:#4a5751; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">ID</th>
                        <th style="padding:12px 16px; color:#4a5751; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Nombre</th>
                        <th style="padding:12px 16px; color:#4a5751; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Email</th>
                        <th style="padding:12px 16px; color:#4a5751; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Rol Actual</th>
                        <th style="padding:12px 16px; color:#4a5751; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Cambiar Rol</th>
                        <th style="padding:12px 16px; color:#4a5751; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($usuarios as $usuario)
                        <tr style="border-bottom:1px solid #eef2ee; transition:background 0.2s;" onmouseover="this.style.background='#f6faf8'" onmouseout="this.style.background='transparent'">
                            <td style="padding:14px 16px; color:#6b7770;">#{{ $usuario->id }}</td>
                            <td style="padding:14px 16px; font-weight:600;">
                                {{ $usuario->nombre }}
                                @if ($usuario->id === Auth::id())
                                    <span style="background:#e8f4f0; color:#1a7a4a; font-size:11px; padding:2px 8px; border-radius:10px; margin-left:6px;">tú</span>
                                @endif
                            </td>
                            <td style="padding:14px 16px; color:#4a5751;">{{ $usuario->email }}</td>
                            <td style="padding:14px 16px;">
                                <span class="status-badge
                                    @if($usuario->rol->nombre === 'admin') status-done
                                    @elseif($usuario->rol->nombre === 'veterinario') status-pending
                                    @else status-canceled
                                    @endif
                                ">{{ $usuario->rol->nombre }}</span>
                            </td>
                            <td style="padding:14px 16px;">
                                @if ($usuario->id !== Auth::id())
                                    <form method="POST" action="{{ url("/admin/usuarios/{$usuario->id}/rol") }}" style="display:flex; gap:8px; align-items:center;">
                                        @csrf
                                        <select name="rol_id" style="
                                            padding:6px 10px; border:1px solid #dce3dc; border-radius:6px;
                                            font-size:13px; outline:none; background:white; cursor:pointer;
                                        ">
                                            @foreach ($roles as $rol)
                                                <option value="{{ $rol->id }}" {{ $usuario->rol_id === $rol->id ? 'selected' : '' }}>
                                                    {{ $rol->nombre }}
                                                </option>
                                            @endforeach
                                        </select>
                                        <button type="submit" style="
                                            background:#00A86B; color:white; border:none;
                                            padding:6px 14px; border-radius:6px; font-size:12px;
                                            font-weight:600; cursor:pointer; white-space:nowrap;
                                            transition:background 0.2s;
                                        " onmouseover="this.style.background='#008f5a'" onmouseout="this.style.background='#00A86B'">Actualizar</button>
                                    </form>
                                @else
                                    <span style="color:#6b7770; font-size:13px;">—</span>
                                @endif
                            </td>
                            <td style="padding:14px 16px;">
                                @if ($usuario->id !== Auth::id())
                                    <form method="POST" action="{{ url("/admin/usuarios/{$usuario->id}") }}"
                                        onsubmit="return confirm('¿Eliminar a {{ $usuario->nombre }}? Esta acción no se puede deshacer.');"
                                        style="display:inline;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" style="
                                            background:transparent; color:#b33a2e; border:1px solid #f5c6cb;
                                            padding:6px 14px; border-radius:6px; font-size:12px;
                                            font-weight:600; cursor:pointer; transition:all 0.2s;
                                        " onmouseover="this.style.background='#fde8e8'" onmouseout="this.style.background='transparent'">🗑️ Eliminar</button>
                                    </form>
                                @else
                                    <span style="color:#6b7770; font-size:13px;">—</span>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div style="margin-top:24px;">
            {{ $usuarios->links() }}
        </div>
    </div>
@endsection
