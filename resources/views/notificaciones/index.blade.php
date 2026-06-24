@php
    use App\Models\Notificacion;
    $misNotificaciones = $notificaciones ?? Notificacion::where('usuario_id', Auth::id())
        ->orderBy('created_at', 'desc')
        ->paginate(20);
@endphp

@extends('layouts.app')

@section('title', 'Notificaciones')

@section('sidebar')
    @parent
    <a href="/dashboard" class="menu-item">🏠 Inicio</a>
    <a href="/notificaciones" class="menu-item active">🔔 Notificaciones</a>
    <a href="/mascotas/registrar" class="menu-item">➕ Registrar Mascota</a>
    <a href="/citas" class="menu-item">📅 Citas</a>
    <a href="/historial" class="menu-item">📋 Historial Clínico</a>
@endsection

@section('breadcrumbs', 'Notificaciones')

@section('content')
<div class="page-header-block">
    <div>
        <h1 class="page-title-sm">🔔 Notificaciones</h1>
        <p class="page-subtitle">Mantente al tanto de citas, vacunaciones y más</p>
    </div>
    @if($misNotificaciones->where('leido', false)->count() > 0)
        <form method="POST" action="/notificaciones/leer-todas" style="display:inline;">
            @csrf
            <button type="submit" class="btn-new-pet" style="font-size:13px; padding:8px 16px;">
                ✅ Marcar todas como leídas
            </button>
        </form>
    @endif
</div>

@if(session('status'))
    <div style="background:#def2e6; color:#1a7a4a; padding:12px 16px; border-radius:10px; margin-bottom:20px; font-size:14px;">
        {{ session('status') }}
    </div>
@endif

@if($misNotificaciones->count() === 0)
    <div class="card" style="text-align:center; padding:60px 20px;">
        <div style="font-size:60px; margin-bottom:15px;">🔕</div>
        <h3 style="color:#1e2f25; margin-bottom:8px;">No hay notificaciones</h3>
        <p style="color:#6b7770; font-size:14px;">Recibirás notificaciones cuando agendes citas o tu veterinario registre vacunaciones.</p>
    </div>
@else
    <div class="card" style="padding:0; overflow:hidden;">
        @foreach($misNotificaciones as $notif)
            <div class="list-item" style="{{ $notif->leido ? '' : 'background:#f0faf5; border-left:4px solid #00A86B;' }}">
                <div class="item-left" style="flex:1;">
                    <span style="font-size:24px;">
                        @switch($notif->tipo)
                            @case('cita') 📅 @break
                            @case('vacunacion') 💉 @break
                            @case('recordatorio') ⏰ @break
                            @case('sistema') ⚙️ @break
                            @default 🔔
                        @endswitch
                    </span>
                    <div style="flex:1;">
                        <strong style="font-size:14px; color:#1e2f25;">{{ $notif->titulo }}</strong>
                        @if($notif->mensaje)
                            <p style="font-size:13px; color:#6b7770; margin-top:2px;">{{ $notif->mensaje }}</p>
                        @endif
                        <small style="color:#a0b4a8; font-size:11px;">
                            {{ $notif->created_at->diffForHumans() }}
                        </small>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    @if($notif->url)
                        <a href="{{ $notif->url }}" class="btn" style="background:#eef2ee; color:#1e2f25; padding:6px 12px; font-size:12px; text-decoration:none; border-radius:6px; flex:none;">
                            Ver
                        </a>
                    @endif
                    @unless($notif->leido)
                        <form method="POST" action="/notificaciones/{{ $notif->id }}/leer" style="display:inline;">
                            @csrf
                            <button type="submit" style="background:none; border:none; cursor:pointer; font-size:12px; color:#00A86B; white-space:nowrap;">
                                ✔ Leída
                            </button>
                        </form>
                    @endunless
                </div>
            </div>
        @endforeach
    </div>

    @if($misNotificaciones instanceof \Illuminate\Pagination\LengthAwarePaginator)
        <div style="margin-top:20px;">
            {{ $misNotificaciones->links() }}
        </div>
    @endif
@endif
@endsection
