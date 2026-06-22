import { useState, useEffect } from 'react';
import {
  Users, Stethoscope, PawPrint, Calendar, Activity, TrendingUp,
  Clock, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { VirtualPet } from './phaser/VirtualPet';
import { dashboardService } from '../../api/services/dashboard';

// Datos mock para gráficos (en producción vienen de la API)
const appointmentData = [
  { name: 'Lun', citas: 4 },
  { name: 'Mar', citas: 6 },
  { name: 'Mié', citas: 8 },
  { name: 'Jue', citas: 5 },
  { name: 'Vie', citas: 7 },
  { name: 'Sáb', citas: 3 },
  { name: 'Dom', citas: 2 },
];

const speciesData = [
  { name: 'Perros', value: 185, color: '#2d6a4f' },
  { name: 'Gatos', value: 98, color: '#74c69d' },
  { name: 'Aves', value: 32, color: '#95d5b2' },
  { name: 'Conejos', value: 18, color: '#52b788' },
  { name: 'Otros', value: 9, color: '#b7e4c7' },
];

const revenueData = [
  { month: 'Ene', ingresos: 4200, gastos: 2100 },
  { month: 'Feb', ingresos: 3800, gastos: 1900 },
  { month: 'Mar', ingresos: 5100, gastos: 2400 },
  { month: 'Abr', ingresos: 4700, gastos: 2200 },
  { month: 'May', ingresos: 5300, gastos: 2500 },
  { month: 'Jun', ingresos: 4900, gastos: 2300 },
];

export function EnhancedDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 127,
    totalVeterinarians: 8,
    totalPets: 342,
    todayAppointments: 15,
    pendingAppointments: 8,
    completedToday: 7,
  });

  useEffect(() => {
    dashboardService.getStats()
      .then(res => setStats(res.data))
      .catch(() => {
        // Usar datos mock si la API no está disponible
        console.log('Usando datos locales para el dashboard');
      });
  }, []);

  const statCards = [
    {
      label: 'Total Usuarios',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      change: '+12%',
      trend: 'up',
    },
    {
      label: 'Veterinarios',
      value: stats.totalVeterinarians,
      icon: Stethoscope,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      textColor: 'text-blue-600 dark:text-blue-400',
      change: '+2',
      trend: 'up',
    },
    {
      label: 'Mascotas Registradas',
      value: stats.totalPets,
      icon: PawPrint,
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      textColor: 'text-amber-600 dark:text-amber-400',
      change: '+8%',
      trend: 'up',
    },
    {
      label: 'Citas Hoy',
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'from-rose-500 to-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      textColor: 'text-rose-600 dark:text-rose-400',
      change: `${stats.completedToday} completadas`,
      trend: 'neutral',
    },
  ];

  const upcomingAppointments = [
    { time: '09:00', pet: 'Max 🐕', owner: 'Carlos Pérez', vet: 'Dra. García', type: 'Vacunación' },
    { time: '10:30', pet: 'Luna 🐱', owner: 'Ana Martínez', vet: 'Dr. López', type: 'Consulta' },
    { time: '11:00', pet: 'Toby 🐕', owner: 'Luis Ramírez', vet: 'Dra. García', type: 'Control' },
    { time: '12:00', pet: 'Piolín 🐦', owner: 'María López', vet: 'Dr. Pérez', type: 'Revisión' },
    { time: '12:30', pet: 'Copito 🐰', owner: 'Juan Sánchez', vet: 'Dra. Rodríguez', type: 'Vacunación' },
  ];

  const recentActivity = [
    { action: 'Nueva mascota registrada', detail: 'Rex - Pastor Alemán', time: 'Hace 15 min', type: 'pet' as const },
    { action: 'Cita completada', detail: 'Luna - Vacunación', time: 'Hace 1 hora', type: 'appointment' as const },
    { action: 'Expediente actualizado', detail: 'Max - Análisis de sangre', time: 'Hace 2 horas', type: 'record' as const },
    { action: 'Nuevo usuario registrado', detail: 'María González', time: 'Hace 3 horas', type: 'user' as const },
    { action: 'Cita cancelada', detail: 'Rocky - Cirugía', time: 'Hace 4 horas', type: 'appointment' as const },
  ];

  const activityIcons = {
    pet: PawPrint,
    appointment: Calendar,
    record: Activity,
    user: Users,
  };

  const activityColors = {
    pet: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30',
    appointment: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
    record: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
    user: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30',
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Panel de Control</h1>
          <p className="text-muted-foreground mt-1">
            Resumen general de la clínica veterinaria
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.textColor}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                stat.trend === 'up'
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                  : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            <div className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r ${stat.color} scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full`} />
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Citas Semanales */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg">Citas de la Semana</h3>
              <p className="text-sm text-muted-foreground">Distribución semanal de consultas</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-3 h-3 rounded-full bg-primary inline-block" />
              <span>Citas programadas</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)',
                  }}
                />
                <Bar
                  dataKey="citas"
                  fill="#2d6a4f"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución de Especies */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg">Pacientes por Especie</h3>
              <p className="text-sm text-muted-foreground">Distribución de mascotas</p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={speciesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {speciesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4 pt-4 border-t border-border">
            {speciesData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas Citas */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-lg">Próximas Citas</h3>
              <p className="text-sm text-muted-foreground">Agenda del día</p>
            </div>
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
              {stats.todayAppointments} hoy
            </span>
          </div>
          <div className="divide-y divide-border">
            {upcomingAppointments.map((apt, idx) => (
              <div key={idx} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-14 text-center">
                    <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                      {apt.time}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{apt.pet}</p>
                    <p className="text-sm text-muted-foreground truncate">{apt.owner}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {apt.type}
                      </span>
                      <span className="text-xs text-muted-foreground">• {apt.vet}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse block" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mascota Virtual (Phaser) */}
        <div>
          <VirtualPet />
        </div>

        {/* Actividad Reciente */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg">Actividad Reciente</h3>
            <p className="text-sm text-muted-foreground">Últimos movimientos</p>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((activity, idx) => {
              const Icon = activityIcons[activity.type];
              return (
                <div key={idx} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${activityColors[activity.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground truncate">{activity.detail}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gráfico de Ingresos */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg">Ingresos Mensuales</h3>
            <p className="text-sm text-muted-foreground">Evolución financiera del semestre</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary inline-block" />
              <span className="text-muted-foreground">Ingresos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary inline-block" />
              <span className="text-muted-foreground">Gastos</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#95d5b2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#95d5b2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                }}
              />
              <Area
                type="monotone"
                dataKey="ingresos"
                stroke="#2d6a4f"
                fill="url(#incomeGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="gastos"
                stroke="#95d5b2"
                fill="url(#expenseGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
