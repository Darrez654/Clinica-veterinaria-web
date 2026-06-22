import { useState } from "react";
import { UserPlus, Search, Mail, Phone, Award } from "lucide-react";

interface Veterinarian {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  license: string;
  yearsExperience: number;
}

export function Veterinarians() {
  const [vets, setVets] = useState<Veterinarian[]>([
    {
      id: 1,
      name: "Dra. María García",
      email: "m.garcia@vetclinic.com",
      phone: "+34 611 222 333",
      specialty: "Cirugía",
      license: "VET-2018-001",
      yearsExperience: 6,
    },
    {
      id: 2,
      name: "Dr. José López",
      email: "j.lopez@vetclinic.com",
      phone: "+34 622 333 444",
      specialty: "Medicina Interna",
      license: "VET-2015-042",
      yearsExperience: 9,
    },
    {
      id: 3,
      name: "Dra. Laura Rodríguez",
      email: "l.rodriguez@vetclinic.com",
      phone: "+34 633 444 555",
      specialty: "Dermatología",
      license: "VET-2020-078",
      yearsExperience: 4,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    license: "",
    yearsExperience: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVet: Veterinarian = {
      id: vets.length + 1,
      ...formData,
    };
    setVets([...vets, newVet]);
    setFormData({ name: "", email: "", phone: "", specialty: "", license: "", yearsExperience: 0 });
    setShowForm(false);
  };

  const filteredVets = vets.filter((vet) =>
    vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vet.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2>Gestión de Veterinarios</h2>
          <p className="text-muted-foreground">Administra el equipo médico de la clínica</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <UserPlus className="w-5 h-5" />
          Nuevo Veterinario
        </button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-lg border border-border mb-6">
          <h3 className="mb-4">Registrar Nuevo Veterinario</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Dra. Ana López"
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="ana.lopez@vetclinic.com"
                />
              </div>
              <div>
                <label className="block mb-2">Teléfono</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="+34 600 000 000"
                />
              </div>
              <div>
                <label className="block mb-2">Especialidad</label>
                <input
                  type="text"
                  required
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Cirugía, Dermatología, etc."
                />
              </div>
              <div>
                <label className="block mb-2">Número de Licencia</label>
                <input
                  type="text"
                  required
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="VET-2024-XXX"
                />
              </div>
              <div>
                <label className="block mb-2">Años de Experiencia</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="5"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Guardar Veterinario
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
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar veterinario por nombre o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredVets.map((vet) => (
            <div key={vet.id} className="bg-muted p-6 rounded-lg border border-border hover:border-primary transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  {vet.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="mb-0">{vet.name}</h4>
                  <p className="text-sm text-muted-foreground">{vet.specialty}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {vet.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {vet.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="w-4 h-4" />
                  {vet.license}
                </div>
                <div className="pt-2 border-t border-border">
                  <span className="text-primary">
                    {vet.yearsExperience} años de experiencia
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
