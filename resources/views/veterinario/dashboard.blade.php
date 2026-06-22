@extends('layouts.app')

@section('title', 'VetClinic - Panel Veterinario')

@section('breadcrumbs', 'Veterinario > Citas Programadas')

@section('sidebar')
    @parent
    <li><a href="/veterinario/dashboard" class="menu-item active">📅 Citas Pendientes</a></li>
    <li><a href="/historial" class="menu-item">📄 Historial Clínico</a></li>
    <li><a href="/dashboard" class="menu-item">🏠 Ir al Portal</a></li>
@endsection

@section('content')
    <div class="page-header-block">
        <div>
            <h1 class="page-title-sm">Citas Programadas</h1>
            <p class="page-subtitle">Revisa y atiende las citas veterinarias pendientes.</p>
        </div>
        <span style="background:#00A86B; color:white; padding:8px 16px; border-radius:10px; font-size:14px; font-weight:600;">
            {{ $citas->count() }} pendiente{{ $citas->count() !== 1 ? 's' : '' }}
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

    @forelse ($citas as $cita)
        <div class="cita-vet-card" style="
            background:white; border-radius:14px; padding:20px 22px;
            border:1px solid #eef2ee; margin-bottom:14px;
            display:flex; align-items:center; gap:20px;
        ">
            {{-- Info principal --}}
            <div style="flex:1; display:grid; grid-template-columns:1fr 1fr 1fr auto; gap:16px; align-items:center;">
                {{-- Paciente --}}
                <div>
                    <span style="font-size:11px; color:#6b7770; text-transform:uppercase; letter-spacing:0.5px;">Paciente</span>
                    <p style="font-size:16px; font-weight:600; margin:2px 0;">{{ $cita->mascota->nombre ?? '—' }}</p>
                    <span style="font-size:12px; color:#6b7770;">
                        {{ $cita->mascota->especie ?? '' }}
                        @if ($cita->mascota->raza) · {{ $cita->mascota->raza }} @endif
                    </span>
                </div>

                {{-- Dueño --}}
                <div>
                    <span style="font-size:11px; color:#6b7770; text-transform:uppercase; letter-spacing:0.5px;">Dueño</span>
                    <p style="font-size:14px; font-weight:500; margin:2px 0;">{{ $cita->mascota->usuario->nombre ?? $cita->usuario->nombre ?? '—' }}</p>
                    <span style="font-size:12px; color:#6b7770;">{{ $cita->mascota->usuario->email ?? '' }}</span>
                </div>

                {{-- Fecha y motivo --}}
                <div>
                    <span style="font-size:11px; color:#6b7770; text-transform:uppercase; letter-spacing:0.5px;">
                        {{ \Carbon\Carbon::parse($cita->fecha)->format('d/m/Y') }} — {{ $cita->hora }}
                    </span>
                    <p style="font-size:14px; margin:2px 0; color:#4a5751;">{{ $cita->motivo }}</p>
                </div>

                {{-- Botón Atender --}}
                <button
                    class="btn-atender"
                    data-cita-id="{{ $cita->id }}"
                    data-mascota="{{ $cita->mascota->nombre ?? '—' }}"
                    data-dueno="{{ $cita->mascota->usuario->nombre ?? $cita->usuario->nombre ?? '—' }}"
                    data-motivo="{{ $cita->motivo }}"
                    style="
                        background:#00A86B; color:white; border:none;
                        padding:12px 24px; border-radius:10px; font-size:14px;
                        font-weight:600; cursor:pointer; white-space:nowrap;
                        transition:background 0.2s;
                    "
                >🩺 Atender</button>
            </div>
        </div>
    @empty
        <div class="card" style="text-align:center; padding:60px;">
            <p style="font-size:48px; margin-bottom:12px;">✅</p>
            <h2 style="color:#1e2f25; margin-bottom:8px;">No hay citas pendientes</h2>
            <p style="color:#6b7770; font-size:14px;">Todas las citas han sido atendidas.</p>
        </div>
    @endforelse

    {{-- ============================================================
         MODAL — Atender cita
         ============================================================ --}}
    <div class="modal-overlay" id="modalAtender" style="
        display:none; position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.4); justify-content:center; align-items:center; z-index:1000;
    ">
        <div class="modal-card" style="
            background:white; border-radius:16px; padding:30px;
            width:520px; max-width:90%; max-height:90vh; overflow-y:auto;
            box-shadow:0 20px 60px rgba(0,0,0,0.15);
        ">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:20px;">
                <div>
                    <h2 style="font-size:20px; margin:0;">🩺 Atender Cita</h2>
                    <p style="font-size:13px; color:#6b7770; margin-top:4px;" id="modalInfo">—</p>
                </div>
                <button onclick="cerrarModal()" style="
                    width:32px; height:32px; border-radius:8px; border:none;
                    background:#f0f4f2; cursor:pointer; font-size:16px;
                    display:flex; align-items:center; justify-content:center;
                ">✕</button>
            </div>

            <form method="POST" id="formAtender">
                @csrf

                <div class="form-group" style="margin-bottom:16px;">
                    <label for="diagnostico" style="display:block; font-size:13px; font-weight:600; color:#4a5751; margin-bottom:6px;">Diagnóstico</label>
                    <textarea name="diagnostico" id="diagnostico" rows="3"
                        class="search-input" placeholder="Ej: Infección cutánea, otitis..."
                        style="width:100%; padding:12px; border:2px solid #e0e8e4; border-radius:10px; font-size:14px; outline:none;"
                    ></textarea>
                </div>

                <div class="form-group" style="margin-bottom:16px;">
                    <label for="tratamiento" style="display:block; font-size:13px; font-weight:600; color:#4a5751; margin-bottom:6px;">Tratamiento recomendado</label>
                    <textarea name="tratamiento" id="tratamiento" rows="3"
                        class="search-input" placeholder="Ej: Antibiótico por 7 días, limpieza diaria..."
                        style="width:100%; padding:12px; border:2px solid #e0e8e4; border-radius:10px; font-size:14px; outline:none;"
                    ></textarea>
                </div>

                <div class="form-group" style="margin-bottom:24px;">
                    <label for="observaciones" style="display:block; font-size:13px; font-weight:600; color:#4a5751; margin-bottom:6px;">Observaciones</label>
                    <textarea name="observaciones" id="observaciones" rows="2"
                        class="search-input" placeholder="Notas adicionales..."
                        style="width:100%; padding:12px; border:2px solid #e0e8e4; border-radius:10px; font-size:14px; outline:none;"
                    ></textarea>
                </div>

                <div style="display:flex; gap:12px; justify-content:flex-end;">
                    <button type="button" onclick="cerrarModal()" style="
                        background:transparent; color:#6b7770; border:1px solid #dce3dc;
                        padding:10px 24px; border-radius:8px; font-size:14px; cursor:pointer;
                    ">Cancelar</button>
                    <button type="submit" style="
                        background:#00A86B; color:white; border:none;
                        padding:10px 24px; border-radius:8px; font-size:14px;
                        font-weight:600; cursor:pointer;
                    ">✅ Completar y Guardar</button>
                </div>
            </form>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    document.querySelectorAll('.btn-atender').forEach(btn => {
        btn.addEventListener('click', function() {
            const citaId   = this.dataset.citaId;
            const mascota  = this.dataset.mascota;
            const dueno    = this.dataset.dueno;
            const motivo   = this.dataset.motivo;

            document.getElementById('modalInfo').textContent =
                `${mascota} — Dueño: ${dueno} — Motivo: ${motivo}`;

            document.getElementById('formAtender').action = `/citas/${citaId}/atender`;
            document.getElementById('formAtender').reset();
            document.getElementById('modalAtender').style.display = 'flex';
        });
    });

    function cerrarModal() {
        document.getElementById('modalAtender').style.display = 'none';
    }

    // Cerrar al hacer clic fuera del modal
    document.getElementById('modalAtender').addEventListener('click', function(e) {
        if (e.target === this) cerrarModal();
    });
</script>
@endpush
