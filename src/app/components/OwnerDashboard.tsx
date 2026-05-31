/**
 * OwnerDashboard - Panel principal del Dueño de Mascota
 * Accede a: Mis mascotas, Citas solicitadas, Expedientes (solo lectura)
 * PUEDE EDITAR: Solo los datos que él/ella registró (mascotas, solicitudes)
 * SOLO LECTURA: Expedientes creados por veterinarios
 */
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  PawPrint, Calendar, FileText, User, Clock,
  Plus, Heart, AlertCircle, Syringe, Scissors,
  Bone, Activity
} from 'lucide-react';

export function OwnerDashboard() {
  const { user, logout } = useAuth();

  const myPets = [
    { name: 'Max', species: 'Perro', breed: 'Labrador', age: 3, weight: 28, photo: '🐕' },
    { name: 'Luna', species: 'Gato', breed: 'Siamés', age: 2, weight: 4, photo: '🐱' },
  ];

  const myAppointments = [
    { date: 'Hoy', time: '09:00', pet: 'Max', vet: 'Dr. Carlos Mendoza', reason: 'Vacunación', status: 'Completada' },
    { date: '15/05', time: '14:30', pet: 'Luna', vet: 'Dra. Ana López', reason: 'Revisión', status: 'Programada' },
    { date: '22/05', time: '10:00', pet: 'Max', vet: 'Dr. Carlos Mendoza', reason: 'Desparasitación', status: 'Programada' },
  ];

  const vetRecords = [
    { pet: 'Max', date: 'Hoy', vet: 'Dr. Carlos Mendoza', diagnosis: 'Vacuna antirrábica aplicada', canEdit: false },
    { pet: 'Luna', date: '10/05', vet: 'Dra. Ana López', diagnosis: 'Control de peso saludable', canEdit: false },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Mis Mascotas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Bienvenido, <span className="font-medium text-amber-600 dark:text-amber-400">{user?.name}</span>
            {' '}·{' '}
            <span className="inline-flex items-center gap-1 text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
              <User className="w-3 h-3" />
              Dueño
            </span>
          </p>
        </div>
      </div>

      {/* Tarjetas de mascotas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-amber-500" />
            Mis Mascotas
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {myPets.length} registradas
            </span>
          </h2>
          <button className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 font-medium flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Registrar mascota
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {myPets.map((pet, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-amber-500/30 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {pet.photo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground">{pet.breed}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                        {pet.species}
                      </span>
                      <span className="text-xs text-muted-foreground">{pet.age} años</span>
                      <span className="text-xs text-muted-foreground">{pet.weight} kg</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Heart className={`w-5 h-5 ${i === 0 ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {/* Acciones rápidas de la mascota */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                <button className="flex-1 text-xs py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 font-medium hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors">
                  Pedir cita
                </button>
                <button className="flex-1 text-xs py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors">
                  Ver expediente
                </button>
                <button className="flex-1 text-xs py-1.5 rounded-lg bg-muted text-muted-foreground font-medium hover:bg-muted/80 transition-colors">
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mis citas */}
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Mis Citas
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {myAppointments.length} citas
            </span>
          </div>
          <div className="divide-y divide-border">
            {myAppointments.map((apt, i) => (
              <div key={i} className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                <div className="text-center min-w-[40px]">
                  <p className="text-xs text-muted-foreground">{apt.date}</p>
                  <p className="text-sm font-bold text-foreground">{apt.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {apt.pet} <span className="text-muted-foreground font-normal">· {apt.vet}</span>
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{apt.reason}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  apt.status === 'Completada' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' :
                  'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border">
            <button className="w-full text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 font-medium flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" />
              Solicitar nueva cita
            </button>
          </div>
        </div>

        {/* Expedientes (solo lectura) */}
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              Expedientes Clínicos
            </h2>
            <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded-full">
              <Activity className="w-3 h-3" />
              Solo lectura
            </span>
          </div>
          <div className="divide-y divide-border">
            {vetRecords.map((rec, i) => (
              <div key={i} className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {rec.pet} <span className="text-muted-foreground font-normal">· {rec.vet}</span>
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{rec.diagnosis}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{rec.date}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
                    Ver
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Los expedientes son creados por veterinarios. No puedes modificarlos.
            </p>
          </div>
        </div>
      </div>

      {/* Leyenda de permisos */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Datos verificados por veterinarios
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Puedes <strong>registrar y modificar</strong> tus mascotas y solicitar citas.
              Los expedientes clínicos y diagnósticos son creados por veterinarios
              y están protegidos como <strong>solo lectura</strong> para garantizar
              la integridad de la información médica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
