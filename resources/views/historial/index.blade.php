@extends('layouts.app')

@section('title', 'VetClinic - Expedientes')

@section('breadcrumbs', 'Home > Expedientes')

@section('sidebar')
    @parent
    <li><a href="/dashboard" class="menu-item">🏠 Mis Mascotas</a></li>
    <li><a href="/mascotas/registrar" class="menu-item">🐾 Registrar Mascota</a></li>
    <li><a href="/citas" class="menu-item">📅 Mis Citas</a></li>
    <li><a href="/historial" class="menu-item active">📄 Expedientes</a></li>
@endsection

@section('content')
    <div class="page-header-block">
        <div>
            <h1 class="page-title-sm">Expedientes Clínicos</h1>
            <p class="page-subtitle">Registros veterinarios y documentos PDF de tus mascotas.</p>
        </div>
        <button onclick="abrirModalSubir()" class="btn-new-pet" style="
            background:#00A86B; color:white; border:none; padding:12px 20px;
            border-radius:10px; font-size:14px; font-weight:bold; cursor:pointer;
            display:inline-flex; align-items:center; gap:8px;
        ">📄 Subir PDF</button>
    </div>

    @if (session('status'))
        <div style="background:#def2e6; color:#1a7a4a; padding:12px 18px; border-radius:10px; margin-bottom:20px; border:1px solid #b8e6c8;">
            {{ session('status') }}
        </div>
    @endif

    {{-- ============================================================
         DOCUMENTOS PDF
         ============================================================ --}}
    @if ($documentos->isNotEmpty())
        <div class="section-header" style="margin-top:10px;">
            <div>📎 Documentos PDF subidos</div>
            <span style="background:#cedbd0; font-size:12px; padding:2px 8px; border-radius:10px;">
                {{ $documentos->count() }} archivo{{ $documentos->count() !== 1 ? 's' : '' }}
            </span>
        </div>

        <div class="management-container" style="margin-bottom:30px; padding:16px 24px;">
            @foreach ($documentos as $doc)
                <div class="list-item">
                    <div class="item-left">
                        <span style="font-size:20px;">📄</span>
                        <div>
                            <strong style="font-size:14px;">{{ $doc->nombre_original }}</strong>
                            <span style="font-size:12px; color:#6b7770; display:block;">
                                🐾 {{ $doc->mascota->nombre ?? '—' }} ·
                                @if ($doc->tamaño) {{ $doc->tamaño }} KB · @endif
                                {{ \Carbon\Carbon::parse($doc->created_at)->format('d/m/Y') }}
                            </span>
                        </div>
                    </div>
                    <a href="/documentos/{{ $doc->id }}/descargar" target="_blank" class="btn-small" style="
                        background:#00A86B; color:white; text-decoration:none;
                        padding:6px 14px; border-radius:8px; font-size:13px;
                    ">📖 Ver PDF</a>
                </div>
            @endforeach
        </div>
    @endif

    {{-- ============================================================
         LÍNEA DE TIEMPO — REGISTROS CLÍNICOS
         ============================================================ --}}
    <div class="section-header">
        <div>📋 Historial Veterinario</div>
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
                    <p style="font-size:14px; color:#4a5751; margin-bottom:8px;">{{ $registro->descripcion }}</p>
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
        <div class="card" style="text-align:center; padding:40px;">
            <p style="font-size:40px; margin-bottom:10px;">📋</p>
            <p style="color:#6b7770; font-size:14px;">Aún no hay registros clínicos de veterinarios.</p>
        </div>
    @endforelse

    @if ($registros->isNotEmpty() || $documentos->isNotEmpty())
        <div class="alert-bar">
            <span>📄</span>
            <span>
                <strong>{{ $registros->count() }} registro{{ $registros->count() !== 1 ? 's' : '' }} clínico{{ $registros->count() !== 1 ? 's' : '' }}</strong>
                · <strong>{{ $documentos->count() }} PDF{{ $documentos->count() !== 1 ? 's' : '' }}</strong> adjunto{{ $documentos->count() !== 1 ? 's' : '' }}.
            </span>
        </div>
    @endif

    {{-- ============================================================
         MODAL — SUBIR PDF
         ============================================================ --}}
    <div class="modal-overlay" id="modalSubirPDF" style="
        display:none; position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.4); justify-content:center; align-items:center; z-index:1000;
    ">
        <div class="modal-card" style="
            background:white; border-radius:16px; padding:30px;
            width:480px; max-width:90%;
            box-shadow:0 20px 60px rgba(0,0,0,0.15);
        ">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:20px;">
                <div>
                    <h2 style="font-size:20px; margin:0;">📄 Subir PDF</h2>
                    <p style="font-size:13px; color:#6b7770; margin-top:4px;">Selecciona la mascota y el archivo PDF.</p>
                </div>
                <button onclick="cerrarModalSubir()" style="
                    width:32px; height:32px; border-radius:8px; border:none;
                    background:#f0f4f2; cursor:pointer; font-size:16px;
                    display:flex; align-items:center; justify-content:center;
                ">✕</button>
            </div>

            <form method="POST" action="/documentos/subir" enctype="multipart/form-data">
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
