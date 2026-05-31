/**
 * VetDashboard - Panel principal del Veterinario
 * Accede a: Expedientes clínicos, Citas, Mascotas (solo lectura de dueños)
 * PUEDE EDITAR: Solo los registros que él/ella creó
 * SOLO LECTURA: Registros creados por otros veterinarios
 */
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  Stethoscope, Calendar, FileText, PawPrint, Users,
  TrendingUp, Clock, CheckCircle, AlertCircle, Plus,
  ArrowRight, Activity, Syringe, Search
} from 'lucide-react';

export function VetDashboard() {
  const { user, logout } = useAuth();

  const stats = [
    {
      label: 'Citas Hoy',
      value: '8',
      change: '+2',
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'Atendidos',
      value: '5',
      change: '62%',
      icon: CheckCircle,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      label: 'Pendientes',
      value: '3',
      change: '',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      label: 'Expedientes',
      value: '24',
      change: '+5 esta semana',
      icon: FileText,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
    },
  ];

  const todayAppointments = [
    { time: '09:00', pet: 'Max', owner: 'Pedro R.', reason: 'Vacunación', status: 'Completada' },
    { time: '10:30', pet: 'Luna', owner: 'María G.', reason: 'Revisión general', status: 'En curso' },
    { time: '11:45', pet: 'Rocky', owner: 'Carlos S.', reason: 'Cirugía', status: 'Programada' },
    { time: '14:00', pet: 'Bella', owner: 'Ana L.', reason: 'Desparasitación', status: 'Programada' },
    { time: '15:30', pet: 'Toby', owner: 'José M.', reason: 'Control', status: 'Programada' },
  ];

  const recentRecords = [
    { pet: 'Max', date: 'Hoy', diagnosis: 'Vacuna antirrábica', vet: user?.name },
    { pet: 'Luna', date: 'Ayer', diagnosis: 'Infección ótica', vet: user?.name },
    { pet: 'Rocky', date: 'Lun', diagnosis: 'Fractura tibia', vet: 'Dra. Ana López' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Panel Veterinario
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Bienvenido, <span className="font-medium text-primary">{user?.name}</span>
            {' '}·{' '}
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              <Stethoscope className="w-3 h-3" />
              {user?.specialty}
            </span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mt-3">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            {stat.change && (
              <p className="text-xs text-emerald-500 mt-1">{stat.change}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Citas de hoy */}
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Citas de Hoy
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {todayAppointments.length} citas
            </span>
          </div>
          <div className="divide-y divide-border">
            {todayAppointments.map((apt, i) => (
              <div key={i} className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                <div className="text-center min-w-[48px]">
                  <p className="text-sm font-bold text-foreground">{apt.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {apt.pet} <span className="text-muted-foreground font-normal">· {apt.owner}</span>
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{apt.reason}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  apt.status === 'Completada' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' :
                  apt.status === 'En curso' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' :
                  'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border">
            <button className="w-full text-sm text-primary hover:text-primary/80 font-medium flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" />
              Nueva cita
            </button>
          </div>
        </div>

        {/* Expedientes recientes (creados por el vet) */}
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Mis Expedientes Recientes
            </h2>
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full">
              <Activity className="w-3 h-3" />
              Editables
            </span>
          </div>
          <div className="divide-y divide-border">
            {recentRecords.map((rec, i) => (
              <div key={i} className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <PawPrint className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{rec.pet}</p>
                  <p className="text-xs text-muted-foreground truncate">{rec.diagnosis}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{rec.date}</p>
                  <p className="text-xs text-primary font-medium">{rec.vet}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border">
            <button className="w-full text-sm text-primary hover:text-primary/80 font-medium flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" />
              Nuevo expediente
            </button>
          </div>
        </div>
      </div>

      {/* Módulos de acceso rápido */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-md hover:bg-primary/5 transition-all group">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-medium text-foreground">Gestionar Citas</span>
          <span className="text-xs text-muted-foreground">Programar y revisar</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-emerald-500/50 hover:shadow-md hover:bg-emerald-500/5 transition-all group">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-foreground">Expedientes</span>
          <span className="text-xs text-muted-foreground">Mis registros clínicos</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-amber-500/50 hover:shadow-md hover:bg-amber-500/5 transition-all group">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 group-hover:scale-110 transition-transform">
            <PawPrint className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-sm font-medium text-foreground">Mascotas</span>
          <span className="text-xs text-muted-foreground">Consultar pacientes</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-purple-500/50 hover:shadow-md hover:bg-purple-500/5 transition-all group">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 group-hover:scale-110 transition-transform">
            <Syringe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-sm font-medium text-foreground">Vacunación</span>
          <span className="text-xs text-muted-foreground">Control de vacunas</span>
        </button>
      </div>

      {/* Leyenda de permisos */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Control de datos verificados
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Solo puedes <strong>modificar</strong> los expedientes y registros que tú mismo hayas creado.
              Los registros de otros veterinarios son de solo lectura para garantizar la integridad de los datos.
              Los datos de los dueños de mascotas no pueden ser modificados por veterinarios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
