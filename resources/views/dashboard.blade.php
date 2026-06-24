@extends('layouts.app')

@section('title', 'VetClinic - Mis Mascotas')

@section('breadcrumbs', 'Home > Mis Mascotas')

@section('sidebar')
    @parent
    <li><a href="/dashboard" class="menu-item active">🏠 Mis Mascotas</a></li>
    <li><a href="/mascotas/registrar" class="menu-item">🐾 Registrar Mascota</a></li>
    <li><a href="/citas" class="menu-item">📅 Mis Citas</a></li>
    <li><a href="/expedientes" class="menu-item">📄 Expedientes</a></li>
    <li><a href="/notificaciones" class="menu-item">🔔 Notificaciones</a></li>
@endsection

@section('content')
    <h1 class="page-title">Mis Mascotas</h1>
    <p class="welcome-text">
        Bienvenido, {{ Auth::user()->nombre }} •
        <span style="background:#f3e6d3; padding:2px 6px; border-radius:4px;">{{ Auth::user()->rol->nombre ?? 'Dueño' }}</span>
    </p>

    @forelse ($mascotas as $mascota)
        @if ($loop->first)
            <div class="section-header">
                <div>
                    Mis Mascotas
                    <span style="background:#cedbd0; font-size:12px; padding:2px 8px; border-radius:10px;">
                        {{ $mascotas->count() }} registrada{{ $mascotas->count() !== 1 ? 's' : '' }}
                    </span>
                </div>
            </div>
            <div class="grid-2">
        @endif

        <div class="card pet-card" style="background-color:#fbf6ee; border:1px solid #f0e6d6;">
            <div class="pet-info" style="display:flex; gap:15px; margin-bottom:15px; position:relative;">
                <div class="pet-img" style="
                    width:70px; height:70px; border-radius:12px;
                    background-color: {{ ['#e3c49a', '#a49689', '#c4a882', '#b8a99a', '#d4b89b'][$loop->index % 5] }};
                    flex-shrink:0;
                "></div>
                <div style="flex:1;">
                    <h2 style="font-size:18px;">{{ $mascota->nombre }}</h2>
                    <p style="color:#6b7770; font-size:14px;">
                        {{ $mascota->raza ?: $mascota->especie }}
                    </p>
                    <span class="pet-badge" style="background:#f3e6d3; padding:2px 8px; border-radius:20px; font-size:12px; display:inline-block; margin-top:5px;">
                        {{ $mascota->especie }}
                    </span>
                    <span style="font-size:13px; margin-left:5px; color:#6b7770;">
                        @if ($mascota->edad) {{ $mascota->edad }} años @endif
                        @if ($mascota->peso) • {{ $mascota->peso }} kg @endif
                    </span>
                </div>
                <span style="position:absolute; right:0; top:0; color:#00A86B; font-size:12px;">
                    {{ $mascota->registros_clinicos_count }} registro{{ $mascota->registros_clinicos_count !== 1 ? 's' : '' }}
                </span>
            </div>
            <div class="btn-group" style="display:flex; gap:10px;">
                <button class="btn btn-orange" style="background-color:#f7dcd0; color:#b05328; border:none; border-radius:10px; padding:10px; font-size:14px; cursor:pointer; flex:1;">
                    Pedir cita
                </button>
                <button class="btn btn-outline" style="background:transparent; border:1px solid #c8bca6; color:#4a3e2e; border-radius:10px; padding:10px; font-size:14px; cursor:pointer; flex:1;">
                    Ver expediente
                </button>
            </div>
        </div>

        @if ($loop->last)
            </div>
        @endif
    @empty
        <div class="card" style="text-align:center; padding:50px;">
            <p style="font-size:48px; margin-bottom:15px;">🐾</p>
            <h2 style="color:#1e2f25; margin-bottom:8px;">Aún no tienes mascotas registradas</h2>
            <p style="color:#6b7770; font-size:14px; margin-bottom:20px;">
                Registra tu primera mascota para empezar a gestionar sus citas y expedientes.
            </p>
            <a href="/mascotas/registrar" class="btn-new-pet">
                🐾 Registrar mi primera mascota
            </a>
        </div>
    @endforelse

    @if ($mascotas->isNotEmpty())
        <div class="alert-bar">
            <div class="alert-icon" style="width:36px; height:36px; border-radius:50%; background:rgba(43,76,126,0.1); display:flex; align-items:center; justify-content:center; flex-shrink:0;">ℹ️</div>
            <div>
                <strong>Datos verificados por veterinarios</strong><br>
                <span style="opacity:0.8; font-size:13px;">Tus expedientes están protegidos y son de solo lectura.</span>
            </div>
        </div>
    @endif
@endsection
