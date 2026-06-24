$root = "C:\xampp\htdocs\ARQUITECTURA DE SOFTWARE\mi-servidor-laravel\src\resources\views"
$file = Join-Path $root "dashboard.blade.php"
$content = Get-Content $file -Raw
$content = $content -replace 'href="/dashboard"', 'href="{{ url('"'"/dashboard"'") }}"'
$content = $content -replace 'href="/mascotas/registrar"', 'href="{{ url('"'"/mascotas/registrar"'") }}"'
$content = $content -replace 'href="/citas"', 'href="{{ url('"'"/citas"'") }}"'
$content = $content -replace 'href="/expedientes"', 'href="{{ url('"'"/expedientes"'") }}"'
$content = $content -replace 'href="/notificaciones"', 'href="{{ url('"'"/notificaciones"'") }}"'
$content = $content -replace '<a href="/mascotas/registrar"', '<a href="{{ url('"'"/mascotas/registrar"'") }}"'
Set-Content $file $content
Write-Host "Fixed dashboard.blade.php"
