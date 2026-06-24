<?php
$root = 'C:/xampp/htdocs/ARQUITECTURA DE SOFTWARE/mi-servidor-laravel/src/resources/views';

$fixes = [
    'registro.blade.php' => [
        ['action="/registro"', 'action="{{ url(\'/registro\') }}"'],
        ['href="/login"', 'href="{{ url(\'/login\') }}"'],
    ],
    'dashboard.blade.php' => [
        ['href="/dashboard"', 'href="{{ url(\'/dashboard\') }}"'],
        ['href="/mascotas/registrar"', 'href="{{ url(\'/mascotas/registrar\') }}"'],
        ['href="/citas"', 'href="{{ url(\'/citas\') }}"'],
        ['href="/expedientes"', 'href="{{ url(\'/expedientes\') }}"'],
        ['href="/notificaciones"', 'href="{{ url(\'/notificaciones\') }}"'],
    ],
    'veterinario/dashboard.blade.php' => [
        ['href="/veterinario/dashboard"', 'href="{{ url(\'/veterinario/dashboard\') }}"'],
        ['href="/notificaciones"', 'href="{{ url(\'/notificaciones\') }}"'],
        ['href="/dashboard"', 'href="{{ url(\'/dashboard\') }}"'],
        ["formAtender.action = '/citas/", "formAtender.action = '{{ url('/citas') }}/"],
    ],
    'notificaciones/index.blade.php' => [
        ['href="/dashboard"', 'href="{{ url(\'/dashboard\') }}"'],
        ['href="/notificaciones"', 'href="{{ url(\'/notificaciones\') }}"'],
        ['href="/mascotas/registrar"', 'href="{{ url(\'/mascotas/registrar\') }}"'],
        ['href="/citas"', 'href="{{ url(\'/citas\') }}"'],
        ['href="/historial"', 'href="{{ url(\'/historial\') }}"'],
        ['action="/notificaciones/leer-todas"', 'action="{{ url(\'/notificaciones/leer-todas\') }}"'],
        ['action="/notificaciones/', 'action="{{ url(\'/notificaciones/\') }}'],
    ],
    'auth/forgot-password.blade.php' => [
        ['action="/olvide-contrasena"', 'action="{{ url(\'/olvide-contrasena\') }}"'],
        ['href="/login"', 'href="{{ url(\'/login\') }}"'],
    ],
    'auth/reset-password.blade.php' => [
        ['action="/restablecer-contrasena"', 'action="{{ url(\'/restablecer-contrasena\') }}"'],
        ['href="/login"', 'href="{{ url(\'/login\') }}"'],
    ],
];

foreach ($fixes as $file => $edits) {
    $path = $root . '/' . $file;
    if (!file_exists($path)) { echo "ERROR: $path not found\n"; continue; }
    $content = file_get_contents($path);
    foreach ($edits as $edit) {
        $old = $edit[0];
        $new = $edit[1];
        if (str_contains($content, $old)) {
            $content = str_replace($old, $new, $content);
            echo "  Fixed: $file\n";
        } else {
            echo "  NOT FOUND in $file: " . substr($old, 0, 30) . "...\n";
        }
    }
    file_put_contents($path, $content);
}
echo "\nDone!\n";
