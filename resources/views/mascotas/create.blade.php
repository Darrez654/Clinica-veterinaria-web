@extends('layouts.app')

@section('title', 'VetClinic - Registrar Mascota')

@section('breadcrumbs', 'Home > Registrar Mascota')

@section('sidebar')
    @parent
    <li><a href="/dashboard" class="menu-item">🏠 Mis Mascotas</a></li>
    <li><a href="/mascotas/registrar" class="menu-item active">🐾 Registrar Mascota</a></li>
    <li><a href="/citas" class="menu-item">📅 Mis Citas</a></li>
    <li><a href="/expedientes" class="menu-item">📄 Expedientes</a></li>
@endsection

@section('content')
    <div class="page-header-block">
        <div>
            <h1 class="page-title-sm">Registrar Nueva Mascota</h1>
            <p class="page-subtitle">Completa los datos de tu mascota para agregarla al sistema.</p>
        </div>
    </div>

    <div class="management-container" style="max-width:600px;">
        <form method="POST" action="/mascotas/registrar">
            @csrf

            <div class="form-group">
                <label for="nombre">Nombre *</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value="{{ old('nombre') }}"
                    class="search-input @error('nombre') is-invalid @enderror"
                    placeholder="Ej: Max, Luna, Toby"
                    required
                >
                @error('nombre')
                    <span style="color:#b33a2e; font-size:13px; margin-top:4px; display:block;">{{ $message }}</span>
                @enderror
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <div class="form-group">
                    <label for="especie">Especie *</label>
                    <select
                        id="especie"
                        name="especie"
                        class="search-input @error('especie') is-invalid @enderror"
                        required
                    >
                        <option value="">Seleccionar...</option>
                        @foreach (['Perro', 'Gato', 'Ave', 'Roedor', 'Reptil', 'Otro'] as $esp)
                            <option value="{{ $esp }}" {{ old('especie') === $esp ? 'selected' : '' }}>{{ $esp }}</option>
                        @endforeach
                    </select>
                    @error('especie')
                        <span style="color:#b33a2e; font-size:13px; margin-top:4px; display:block;">{{ $message }}</span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="raza">Raza</label>
                    <input
                        type="text"
                        id="raza"
                        name="raza"
                        value="{{ old('raza') }}"
                        class="search-input @error('raza') is-invalid @enderror"
                        placeholder="Ej: Labrador, Siamés"
                    >
                    @error('raza')
                        <span style="color:#b33a2e; font-size:13px; margin-top:4px; display:block;">{{ $message }}</span>
                    @enderror
                </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <div class="form-group">
                    <label for="edad">Edad (años)</label>
                    <input
                        type="number"
                        id="edad"
                        name="edad"
                        value="{{ old('edad') }}"
                        class="search-input @error('edad') is-invalid @enderror"
                        min="0"
                        max="50"
                        step="1"
                        placeholder="Ej: 3"
                    >
                    @error('edad')
                        <span style="color:#b33a2e; font-size:13px; margin-top:4px; display:block;">{{ $message }}</span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="peso">Peso (kg)</label>
                    <input
                        type="number"
                        id="peso"
                        name="peso"
                        value="{{ old('peso') }}"
                        class="search-input @error('peso') is-invalid @enderror"
                        min="0"
                        step="0.01"
                        placeholder="Ej: 12.5"
                    >
                    @error('peso')
                        <span style="color:#b33a2e; font-size:13px; margin-top:4px; display:block;">{{ $message }}</span>
                    @enderror
                </div>
            </div>

            <div style="display:flex; gap:12px; margin-top:24px; justify-content:flex-end;">
                <a href="/dashboard" class="btn-cancel-profile" style="
                    background: transparent; color: #6b7770; border: 1px solid #dce3dc;
                    padding: 10px 28px; border-radius: 8px; font-size: 14px;
                    cursor: pointer; text-decoration: none; transition: all 0.2s;
                ">Cancelar</a>
                <button type="submit" class="btn-save" style="
                    background: #00A86B; color: white; border: none;
                    padding: 10px 28px; border-radius: 8px; font-size: 14px;
                    font-weight: 600; cursor: pointer; transition: background 0.2s;
                ">🐾 Registrar Mascota</button>
            </div>
        </form>
    </div>
@endsection
