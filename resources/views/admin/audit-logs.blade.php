@extends('layouts.app')

@section('title', 'VetClinic - Auditoría')

@section('breadcrumbs', 'Admin > Auditoría')

@section('sidebar')
    @parent
    <li><a href="/admin/audit-logs" class="menu-item active">📋 Auditoría</a></li>
    <li><a href="/admin/usuarios" class="menu-item">👥 Usuarios</a></li>
    <li><a href="/notificaciones" class="menu-item">🔔 Notificaciones</a></li>
    <li><a href="/dashboard" class="menu-item">🏠 Ir al Portal</a></li>
@endsection

@section('content')
    {{-- ============================================================
         ALERTAS DE ANOMALÍAS
         ============================================================ --}}
    @if ($anomalias->count() > 0)
        <div style="background:#fff0f0; border:1px solid #f5c6cb; border-radius:14px; padding:20px; margin-bottom:25px;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                <span style="font-size:24px;">🚨</span>
                <div>
                    <h3 style="margin:0; color:#b33a2e;">{{ $anomalias->count() }} anomalía{{ $anomalias->count() !== 1 ? 's' : '' }} reciente{{ $anomalias->count() !== 1 ? 's' : '' }}</h3>
                    <p style="margin:2px 0 0; color:#6b7770; font-size:13px;">Últimas alertas de seguridad detectadas</p>
                </div>
            </div>

            @foreach ($anomalias as $anomalia)
                <div style="
                    background:white; border-radius:10px; padding:14px 16px; margin-bottom:8px;
                    border-left:4px solid #dc3545;
                ">
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <div>
                            <span style="
                                display:inline-block; padding:2px 10px; border-radius:10px;
                                font-size:11px; font-weight:700; text-transform:uppercase;
                                background:#dc3545; color:white; margin-bottom:6px;
                            ">{{ $anomalia->tipo }}</span>
                            <p style="margin:0; font-size:14px;">{{ $anomalia->detalle }}</p>
                            @if ($anomalia->payload)
                                <code style="display:block; margin-top:6px; font-size:12px; color:#6b7770; background:#f5f7f6; padding:6px 10px; border-radius:6px; word-break:break-all;">
                                    {{ $anomalia->payload }}
                                </code>
                            @endif
                        </div>
                        <div style="text-align:right; font-size:12px; color:#6b7770; white-space:nowrap;">
                            <div>{{ $anomalia->created_at->format('d/m/y H:i') }}</div>
                            <div>IP: {{ $anomalia->ip }}</div>
                            @if ($anomalia->usuario)
                                <div>{{ $anomalia->usuario->nombre }}</div>
                            @endif
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @endif

    {{-- ============================================================
         LISTADO COMPLETO DE AUDITORÍA
         ============================================================ --}}
    <div class="page-header-block">
        <div>
            <h1 class="page-title-sm">Registro de Auditoría</h1>
            <p class="page-subtitle">Todas las solicitudes realizadas al sistema.</p>
        </div>
        <span style="background:#00A86B; color:white; padding:8px 16px; border-radius:10px; font-size:14px; font-weight:600;">
            {{ $logs->total() }} registro{{ $logs->total() !== 1 ? 's' : '' }}
        </span>
    </div>

    @if (session('status'))
        <div style="background:#def2e6; color:#1a7a4a; padding:12px 18px; border-radius:10px; margin-bottom:20px; border:1px solid #b8e6c8;">
            {{ session('status') }}
        </div>
    @endif

    <div class="management-container">
        <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead>
                    <tr style="border-bottom:2px solid #eef2ee; text-align:left;">
                        <th style="padding:10px 12px; color:#4a5751; font-size:11px; text-transform:uppercase;">Fecha</th>
                        <th style="padding:10px 12px; color:#4a5751; font-size:11px; text-transform:uppercase;">Usuario</th>
                        <th style="padding:10px 12px; color:#4a5751; font-size:11px; text-transform:uppercase;">IP</th>
                        <th style="padding:10px 12px; color:#4a5751; font-size:11px; text-transform:uppercase;">Método</th>
                        <th style="padding:10px 12px; color:#4a5751; font-size:11px; text-transform:uppercase;">Ruta</th>
                        <th style="padding:10px 12px; color:#4a5751; font-size:11px; text-transform:uppercase;">Severidad</th>
                        <th style="padding:10px 12px; color:#4a5751; font-size:11px; text-transform:uppercase;">Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($logs as $log)
                        <tr style="border-bottom:1px solid #eef2ee; transition:background 0.2s;"
                            @if($log->severidad === 'ALTA') style="border-bottom:1px solid #f5c6cb; background:#fff5f5;" @endif
                            onmouseover="this.style.background='#f6faf8'" onmouseout="this.style.background=''">
                            <td style="padding:10px 12px; color:#6b7770; white-space:nowrap;">
                                {{ $log->created_at->format('d/m/y H:i:s') }}
                            </td>
                            <td style="padding:10px 12px;">
                                @if ($log->usuario)
                                    <strong>{{ $log->usuario->nombre }}</strong>
                                @else
                                    <span style="color:#abb5af;">—</span>
                                @endif
                            </td>
                            <td style="padding:10px 12px; color:#4a5751; font-family:monospace;">{{ $log->ip }}</td>
                            <td style="padding:10px 12px;">
                                <span style="
                                    padding:2px 8px; border-radius:4px; font-size:11px; font-weight:600;
                                    @if($log->metodo === 'GET') background:#e8f4f0; color:#1a7a4a;
                                    @elseif($log->metodo === 'POST') background:#e0edfa; color:#1a4a7a;
                                    @elseif($log->metodo === 'DELETE') background:#fde8e8; color:#b33a2e;
                                    @else background:#f0f0f0; color:#4a5751;
                                    @endif
                                ">{{ $log->metodo }}</span>
                            </td>
                            <td style="padding:10px 12px; max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                                <span title="{{ $log->ruta }}">{{ $log->ruta }}</span>
                            </td>
                            <td style="padding:10px 12px;">
                                @if ($log->severidad === 'ALTA')
                                    <span class="status-badge status-canceled">🔴 ALTA</span>
                                @elseif ($log->severidad === 'MEDIA')
                                    <span class="status-badge status-pending">🟡 MEDIA</span>
                                @else
                                    <span class="status-badge status-done">🟢 BAJA</span>
                                @endif
                            </td>
                            <td style="padding:10px 12px;">
                                @if ($log->tipo === 'normal')
                                    <span style="color:#6b7770;">normal</span>
                                @else
                                    <span style="
                                        display:inline-block; padding:2px 8px; border-radius:8px;
                                        font-size:11px; font-weight:700; text-transform:uppercase;
                                        background:#dc3545; color:white;
                                    ">{{ $log->tipo }}</span>
                                @endif
                            </td>
                        </tr>
                        {{-- Mostrar detalle si es anomalía --}}
                        @if ($log->severidad === 'ALTA' && $log->detalle)
                            <tr style="background:#fff5f5; border-bottom:1px solid #f5c6cb;">
                                <td colspan="7" style="padding:6px 12px 12px;">
                                    <code style="font-size:12px; color:#b33a2e;">
                                        {{ $log->detalle }}
                                    </code>
                                    @if ($log->payload)
                                        <pre style="font-size:11px; color:#6b7770; margin:4px 0 0; background:#f5f7f6; padding:6px 10px; border-radius:6px; white-space:pre-wrap;">{{ $log->payload }}</pre>
                                    @endif
                                </td>
                            </tr>
                        @endif
                    @empty
                        <tr>
                            <td colspan="7" style="padding:40px; text-align:center; color:#6b7770;">
                                <p style="font-size:32px; margin-bottom:8px;">📋</p>
                                <p>Aún no hay registros de auditoría.</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div style="margin-top:24px;">
            {{ $logs->links() }}
        </div>
    </div>
@endsection
