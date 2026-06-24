<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'VetClinic - Panel')</title>
    <style>
        /* ================================================================
           1. RESET & GLOBAL
           ================================================================ */
        *  { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { background-color: #dde9e7; color: #1e2f25; min-height: 100vh; }

        /* ================================================================
           2. SIDEBAR
           ================================================================ */
        .sidebar {
            position: fixed; left: 0; top: 0; width: 260px; height: 100vh; z-index: 100;
            background-color: #1e2d2f; display: flex; flex-direction: column;
            justify-content: space-between; padding: 20px 0;
            transition: transform 0.3s ease; overflow: hidden;
        }
        .sidebar.hidden { transform: translateX(-260px); }

        .brand-container { display: flex; align-items: center; gap: 12px; padding: 10px 24px; }
        .brand-icon { width: 40px; height: 40px; background-color: #00A86B; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; }
        .brand-text-title   { font-size: 18px; font-weight: bold; color: #ffffff; }
        .brand-text-subtitle { font-size: 12px; color: #00A86B; font-weight: 500; }

        .menu-items { list-style: none; margin-top: 30px; flex-grow: 1; }
        .menu-item {
            padding: 14px 24px; display: flex; align-items: center; gap: 12px;
            cursor: pointer; color: #a0b4a8; text-decoration: none; font-size: 15px;
            transition: all 0.2s;
        }
        .menu-item:hover,
        .menu-item.active { background-color: #00A86B; color: white; border-radius: 0 12px 12px 0; margin-right: 15px; }

        .sidebar-footer { padding: 20px 24px; border-top: 1px solid #2d3f41; font-size: 13px; color: #a0b4a8; }

        /* ================================================================
           3. MAIN WRAPPER
           ================================================================ */
        .main-wrapper { margin-left: 260px; min-height: 100vh; display: flex; flex-direction: column; transition: margin-left 0.3s ease; }
        .main-wrapper.expanded { margin-left: 0; }

        /* ================================================================
           4. TOP HEADER
           ================================================================ */
        .top-header {
            position: sticky; top: 0; z-index: 50; background-color: #dde9e7;
            padding: 20px 30px; display: flex; justify-content: space-between;
            align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .breadcrumbs { font-size: 14px; color: #6b7770; }

        .toggle-btn {
            background: white; border: 1px solid #d0d9d5; border-radius: 8px;
            font-size: 20px; cursor: pointer; color: #1e2f25; padding: 6px 10px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.06); transition: all 0.2s; line-height: 1;
        }
        .toggle-btn:hover { background: #00A86B; color: white; border-color: #00A86B; }

        .user-profile { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .avatar {
            width: 40px; height: 40px; background-color: #00A86B; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: bold; font-size: 16px;
        }

        /* ================================================================
           5. MAIN CONTENT
           ================================================================ */
        .main-content { flex: 1; padding: 30px; overflow-y: auto; }

        /* ================================================================
           6. COMPONENTES COMUNES
           ================================================================ */
        .page-title { font-size: 28px; margin-bottom: 5px; }
        .page-title-sm { font-size: 24px; color: #1a3825; margin-bottom: 4px; }
        .page-subtitle { font-size: 14px; color: #617366; }
        .welcome-text { font-size: 14px; color: #6b7770; margin-bottom: 25px; }
        .page-header-block { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-size: 18px; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }

        .btn {
            flex: 1; padding: 10px; border-radius: 10px; border: none;
            font-size: 14px; cursor: pointer; text-align: center;
        }
        .btn-new-pet { background-color: #1e4a38; color: white; border: none; padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }

        .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.3px; display: inline-block; }
        .status-done    { background-color: #def2e6; color: #1a7a4a; }
        .status-pending { background-color: #fff0e6; color: #b05328; }
        .status-canceled { background-color: #fee9e7; color: #b33a2e; }

        .list-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; margin: 0 -16px; border-bottom: 1px solid #eef2ee; font-size: 14px; transition: background 0.2s; border-radius: 8px; }
        .list-item:hover { background: #f6faf8; }
        .list-item:last-child { border-bottom: none; }
        .list-item .item-left { display: flex; align-items: center; gap: 12px; }

        .alert-bar { background: linear-gradient(135deg, #dbe7f6 0%, #e8f0fa 100%); border-radius: 12px; padding: 16px 20px; font-size: 14px; color: #2b4c7e; display: flex; align-items: center; gap: 12px; margin-top: 25px; border: 1px solid rgba(43,76,126,0.08); }

        .management-container { background: white; border-radius: 12px; border: 1px solid #eef2ee; padding: 24px; }
        .search-container { margin-bottom: 24px; }
        .search-input { width: 100%; padding: 12px 16px; border: 1px solid #dce3dc; border-radius: 8px; font-size: 14px; color: #1e2f25; outline: none; }
        .filter-container { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .filter-badge { padding: 6px 16px; border-radius: 20px; border: 1px solid #dce3dc; background: white; color: #4a5751; font-size: 13px; cursor: pointer; transition: all 0.2s; font-weight: 500; }
        .filter-badge:hover { border-color: #00A86B; color: #00A86B; }
        .filter-badge.active { background: #00A86B; color: white; border-color: #00A86B; }

        @media (max-width: 768px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }
    </style>
    @stack('styles')
</head>
<body>

    <!-- ============================================================
         SIDEBAR
         ============================================================ -->
    <nav class="sidebar" id="mainSidebar">
        <div>
            <div class="brand-container">
                <div class="brand-icon">🐾</div>
                <div>
                    <div class="brand-text-title">VetClinic</div>
                    <div class="brand-text-subtitle">
                        @auth
                            {{ Auth::user()->rol->nombre ?? 'Usuario' }}
                        @endauth
                    </div>
                </div>
            </div>
            <ul class="menu-items">
                @section('sidebar')
                    @auth
                        @if(Auth::user()->rol->nombre === 'admin')
                            <li><a href="{{ url('/admin/audit-logs') }}" class="menu-item">📋 Auditoría</a></li>
                            <li><a href="{{ url('/admin/usuarios') }}" class="menu-item">👥 Usuarios</a></li>
                        @endif
                    @endauth
                    <li><a href="{{ url('/dashboard') }}" class="menu-item">🏠 Inicio</a></li>
                    <li><a href="{{ url('/notificaciones') }}" class="menu-item">🔔 Notificaciones</a></li>
                @show
            </ul>
        </div>
        <div class="sidebar-footer">
            @auth
                <div>
                    <strong>{{ Auth::user()->nombre }}</strong><br>
                    <span style="opacity:0.7;">{{ Auth::user()->email }}</span>
                </div>
                <form method="POST" action="{{ url('/logout') }}" style="display:inline;">
                    @csrf
                    <button type="submit" style="background:none;border:none;color:#b33a2e;cursor:pointer;font-size:13px;">🚪 Salir</button>
                </form>
            @endauth
        </div>
    </nav>

    <!-- ============================================================
         MAIN
         ============================================================ -->
    <div class="main-wrapper">
        <header class="top-header">
            <div style="display:flex;align-items:center;gap:10px;">
                <button class="toggle-btn" onclick="toggleMenu()">☰</button>
                <div class="breadcrumbs">@yield('breadcrumbs', 'Home')</div>
            </div>
            @auth
                @php
                    use App\Models\Notificacion;
                    $noLeidas = Notificacion::noLeidas(Auth::id());
                @endphp
                <a href="{{ url('/notificaciones') }}" style="position:relative; text-decoration:none; font-size:22px; padding:6px 10px; border-radius:8px; background:white; border:1px solid #d0d9d5; box-shadow:0 1px 4px rgba(0,0,0,0.06); margin-right:8px;" onmouseover="this.style.background='#00A86B'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#1e2f25'">
                    🔔
                    @if($noLeidas > 0)
                        <span style="position:absolute; top:-4px; right:-6px; background:#dc3545; color:white; font-size:10px; font-weight:bold; min-width:18px; height:18px; border-radius:9px; display:flex; align-items:center; justify-content:center; padding:0 4px;">
                            {{ $noLeidas > 9 ? '9+' : $noLeidas }}
                        </span>
                    @endif
                </a>
            @endauth
            <a href="{{ url('/perfil') }}" class="user-profile" style="text-decoration:none;color:inherit;">
                <div style="text-align:right;font-size:14px;">
                    <strong>@auth {{ Auth::user()->nombre }} @endauth</strong><br>
                    <span style="opacity:0.7;font-size:12px;">@auth {{ Auth::user()->email }} @endauth</span>
                </div>
                <div class="avatar">
                    @auth {{ strtoupper(substr(Auth::user()->nombre, 0, 2)) }} @endauth
                </div>
            </a>
        </header>

        <main class="main-content">
            @yield('content')
        </main>
    </div>

    <!-- ============================================================
         TOGGLE SIDEBAR
         ============================================================ -->
    <script>
        function toggleMenu() {
            var sidebar = document.getElementById('mainSidebar');
            var wrapper = document.querySelector('.main-wrapper');
            sidebar.classList.toggle('hidden');
            wrapper.classList.toggle('expanded');
        }
    </script>

    @stack('scripts')
</body>
</html>
