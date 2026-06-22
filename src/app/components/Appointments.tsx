import { useState } from "react";
import { Calendar, Plus, Search, Clock, CheckCircle, XCircle } from "lucide-react";

interface Appointment {
  id: number;
  date: string;
  time: string;
  pet: string;
  owner: string;
  veterinarian: string;
  reason: string;
  status: "Programada" | "Completada" | "Cancelada";
}

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      date: "2024-05-26",
      time: "09:00",
      pet: "Max",
      owner: "Carlos Pérez",
      veterinarian: "Dra. María García",
      reason: "Vacunación anual",
      status: "Programada",
    },
    {
      id: 2,
      date: "2024-05-26",
      time: "10:30",
      pet: "Luna",
      owner: "Ana Martínez",
      veterinarian: "Dr. José López",
      reason: "Consulta general",
      status: "Programada",
    },
    {
      id: 3,
      date: "2024-05-26",
      time: "12:00",
      pet: "Toby",
      owner: "Luis Ramírez",
      veterinarian: "Dra. María García",
      reason: "Control de peso",
      status: "Programada",
    },
    {
      id: 4,
      date: "2024-05-25",
      time: "14:00",
      pet: "Rex",
      owner: "María González",
      veterinarian: "Dr. José López",
      reason: "Cirugía menor",
      status: "Completada",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Todas");
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    pet: "",
    owner: "",
    veterinarian: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      id: appointments.length + 1,
      ...formData,
      status: "Programada",
    };
    setAppointments([...appointments, newAppointment]);
    setFormData({ date: "", time: "", pet: "", owner: "", veterinarian: "", reason: "" });
    setShowForm(false);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.pet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.veterinarian.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "Todas" || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: number, status: "Programada" | "Completada" | "Cancelada") => {
    setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status } : apt));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2>Gestión de Citas</h2>
          <p className="text-muted-foreground">Programa y administra las citas veterinarias</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Nueva Cita
        </button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-lg border border-border mb-6">
          <h3 className="mb-4">Programar Nueva Cita</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2">Fecha</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block mb-2">Hora</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block mb-2">Mascota</label>
                <input
                  type="text"
                  required
                  value={formData.pet}
                  onChange={(e) => setFormData({ ...formData, pet: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Max"
                />
              </div>
              <div>
                <label className="block mb-2">Propietario</label>
                <input
                  type="text"
                  required
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Carlos Pérez"
                />
              </div>
              <div>
                <label className="block mb-2">Veterinario</label>
                <input
                  type="text"
                  required
                  value={formData.veterinarian}
                  onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Dra. María García"
                />
              </div>
              <div>
                <label className="block mb-2">Motivo</label>
                <input
                  type="text"
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Vacunación, Consulta, etc."
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Programar Cita
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-muted text-muted-foreground px-6 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar cita por mascota, propietario o veterinario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            {["Todas", "Programada", "Completada", "Cancelada"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-muted p-4 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1 rounded">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{apt.time}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        apt.status === "Programada"
                          ? "bg-secondary text-secondary-foreground"
                          : apt.status === "Completada"
                          ? "bg-primary text-primary-foreground"
                          : "bg-destructive text-destructive-foreground"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Mascota: </span>
                      <span>{apt.pet}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Propietario: </span>
                      <span>{apt.owner}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Veterinario: </span>
                      <span>{apt.veterinarian}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Motivo: </span>
                    <span>{apt.reason}</span>
                  </div>
                </div>
                {apt.status === "Programada" && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => updateStatus(apt.id, "Completada")}
                      className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                      title="Marcar como completada"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => updateStatus(apt.id, "Cancelada")}
                      className="p-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                      title="Cancelar cita"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
