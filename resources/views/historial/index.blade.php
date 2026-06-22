@extends('layouts.app')

@section('title', 'VetClinic - Historial Clínico')

@section('breadcrumbs', 'Home > Historial Clínico')

@section('sidebar')
    @parent
    <li><a href="/dashboard" class="menu-item">🏠 Mis Mascotas</a></li>
    <li><a href="/mascotas/registrar" class="menu-item">🐾 Registrar Mascota</a></li>
    <li><a href="/citas" class="menu-item">📅 Mis Citas</a></li>
    <li><a href="/historial" class="menu-item active">📄 Historial Clínico</a></li>
@endsection

@section('content')
    <div class="page-header-block">
        <div>
            <h1 class="page-title-sm">Historial Clínico</h1>
            <p class="page-subtitle">Todos los registros veterinarios de tus mascotas, ordenados por fecha.</p>
        </div>
    </div>

    @forelse ($registros as $registro)
        @php
            $colors = ['#e8f0fa', '#f3e6d3', '#def2e6', '#fce4e4', '#fef3d6'];
            $icons  = ['💉', '🩺', '💊', '🧪', '🏥'];
            $idx    = $loop->index % 5;
        @endphp

        <div class="record-card" style="
            display:flex; gap:18px; margin-bottom:16px;
            background:white; border-radius:14px; padding:20px 22px;
            border:1px solid #eef2ee; transition:all 0.2s;
        ">
            {{-- Indicador visual izquierdo (icono + línea temporal) --}}
            <div style="display:flex; flex-direction:column; align-items:center; width:36px; flex-shrink:0;">
                <div style="
                    width:36px; height:36px; border-radius:50%;
                    background:{{ $colors[$idx] }}; display:flex;
                    align-items:center; justify-content:center; font-size:16px;
                ">{{ $icons[$idx] }}</div>
                @if (!$loop->last)
                    <div style="width:2px; flex:1; background:#dce3dc; margin:4px 0;"></div>
                @endif
            </div>

            {{-- Contenido del registro --}}
            <div style="flex:1; min-width:0;">
                <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:10px;">
                    <span style="font-weight:600; font-size:16px; color:#1e2f25;">
                        {{ $registro->mascota->nombre ?? '—' }}
                    </span>
                    <span class="badge-type" style="
                        padding:2px 10px; border-radius:20px; font-size:12px;
                        background:{{ $colors[$idx] }}; color:#4a5751;
                    ">{{ $registro->tipo ?? 'Consulta' }}</span>
                    <span style="font-size:13px; color:#6b7770; margin-left:auto;">
                        {{ \Carbon\Carbon::parse($registro->fecha)->format('d/m/Y') }}
                    </span>
                </div>

                @if ($registro->descripcion)
                    <p style="font-size:14px; color:#4a5751; margin-bottom:8px;">
                        {{ $registro->descripcion }}
                    </p>
                @endif

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:10px;">
                    @if ($registro->diagnostico)
                        <div class="detail-tag" style="background:#f8fafa; border-radius:8px; padding:10px 12px;">
                            <span style="font-size:11px; color:#6b7770; text-transform:uppercase; letter-spacing:0.5px;">Diagnóstico</span>
                            <p style="font-size:14px; margin:2px 0 0; font-weight:500;">{{ $registro->diagnostico }}</p>
                        </div>
                    @endif
                    @if ($registro->tratamiento)
                        <div class="detail-tag" style="background:#f8fafa; border-radius:8px; padding:10px 12px;">
                            <span style="font-size:11px; color:#6b7770; text-transform:uppercase; letter-spacing:0.5px;">Tratamiento</span>
                            <p style="font-size:14px; margin:2px 0 0; font-weight:500;">{{ $registro->tratamiento }}</p>
                        </div>
                    @endif
                </div>

                @if ($registro->observaciones)
                    <div style="margin-top:10px; font-size:13px; color:#6b7770; padding:8px 12px; background:#fafbfa; border-radius:6px;">
                        📝 {{ $registro->observaciones }}
                    </div>
                @endif

                <div style="margin-top:10px; font-size:12px; color:#6b7770; display:flex; gap:16px;">
                    <span>👨‍⚕️ {{ $registro->veterinario->nombre ?? 'Veterinario' }}</span>
                </div>
            </div>
        </div>
    @empty
        <div class="card" style="text-align:center; padding:60px 40px;">
            <p style="font-size:48px; margin-bottom:12px;">📋</p>
            <h2 style="color:#1e2f25; margin-bottom:8px; font-size:20px;">Aún no hay registros clínicos</h2>
            <p style="color:#6b7770; font-size:14px; max-width:380px; margin:0 auto;">
                Cuando un veterinario realice una consulta o tratamiento a tus mascotas,
                aquí aparecerá su historial detallado.
            </p>
            <a href="/dashboard" class="btn-new-pet" style="display:inline-flex; margin-top:24px;">
                🏠 Volver a Mis Mascotas
            </a>
        </div>
    @endforelse

    @if ($registros->isNotEmpty())
        <div class="alert-bar">
            <span>📄</span>
            <span>
                <strong>{{ $registros->count() }} registro{{ $registros->count() !== 1 ? 's' : '' }} clínico{{ $registros->count() !== 1 ? 's' : '' }}</strong> en total.
                Solo los veterinarios pueden añadir nuevas entradas al historial.
            </span>
        </div>
    @endif
@endsection
