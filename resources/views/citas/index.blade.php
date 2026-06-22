@extends('layouts.app')

@section('title', 'VetClinic - Mis Citas')

@section('breadcrumbs', 'Home > Mis Citas')

@section('sidebar')
    @parent
    <li><a href="/dashboard" class="menu-item">🏠 Mis Mascotas</a></li>
    <li><a href="/mascotas/registrar" class="menu-item">🐾 Registrar Mascota</a></li>
    <li><a href="/citas" class="menu-item active">📅 Mis Citas</a></li>
    <li><a href="/expedientes" class="menu-item">📄 Expedientes</a></li>
@endsection

@section('content')
    <div class="page-header-block">
        <div>
            <h1 class="page-title-sm">Mis Citas</h1>
            <p class="page-subtitle">Administra tus citas veterinarias o agenda una nueva.</p>
        </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 360px; gap:24px; align-items:start;">

        {{-- ============================================================
             COLUMNA IZQUIERDA — LISTADO DE CITAS
             ============================================================ --}}
        <div>
            <div class="management-container">
                <div class="section-header">
                    <div>Citas agendadas</div>
                    <span style="background:#cedbd0; font-size:12px; padding:2px 8px; border-radius:10px;">
                        {{ $citas->count() }} cita{{ $citas->count() !== 1 ? 's' : '' }}
                    </span>
                </div>

                @forelse ($citas as $cita)
                    <div class="appointment-row" style="
                        border:1px solid #eef2ee; border-radius:12px;
                        padding:16px 20px; background:#fafcfa;
                        margin-bottom:12px; transition:all 0.2s;
                    ">
                        <div style="display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap;">
                            <span class="badge-info" style="padding:4px 12px; border-radius:20px; font-size:12px; font-weight:500; background:#f0f4f2; color:#4a5751;">
                                🐾 {{ $cita->mascota->nombre ?? '—' }}
                            </span>
                            <span class="badge-time" style="padding:4px 12px; border-radius:20px; font-size:12px; font-weight:500; background:#e8f0fa; color:#2b4c7e;">
                                {{ \Carbon\Carbon::parse($cita->fecha)->format('d/m/Y') }} — {{ $cita->hora }}
                            </span>
                            <span class="status-badge {{ $cita->estado === 'completada' ? 'status-done' : ($cita->estado === 'cancelada' ? 'status-canceled' : 'status-pending') }}">
                                {{ $cita->estado }}
                            </span>
                        </div>

                        <div style="display:grid; grid-template-columns:1fr auto; gap:16px; align-items:center;">
                            <div>
                                <p style="font-size:13px; margin-bottom:4px;">
                                    <span style="color:#6b7770;">Motivo:</span>
                                    <span style="font-weight:500;">{{ $cita->motivo }}</span>
                                </p>
                                <p style="font-size:13px; margin:0;">
                                    <span style="color:#6b7770;">Veterinario:</span>
                                    <span style="font-weight:500;">{{ $cita->veterinario->nombre ?? 'Pendiente' }}</span>
                                </p>
                            </div>
                            @if ($cita->estado === 'programada')
                                <form method="POST" action="/citas/{{ $cita->id }}/cancelar" onsubmit="return confirm('¿Cancelar esta cita?')">
                                    @csrf
                                    <button type="submit" class="btn-action btn-cancel" style="
                                        width:32px; height:32px; border-radius:8px; border:none;
                                        background:#fee9e7; color:#b33a2e; cursor:pointer;
                                        display:flex; align-items:center; justify-content:center;
                                    " title="Cancelar cita">✕</button>
                                </form>
                            @endif
                        </div>
                    </div>
                @empty
                    <div style="text-align:center; padding:40px; color:#6b7770;">
                        <p style="font-size:40px; margin-bottom:10px;">📅</p>
                        <p style="font-size:16px; font-weight:500;">No tienes citas agendadas</p>
                        <p style="font-size:13px;">Usa el formulario de la derecha para agendar una.</p>
                    </div>
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

                <form method="POST" action="/citas">
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
