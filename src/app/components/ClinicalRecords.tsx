import { useState } from "react";
import { FileText, Plus, Search, Calendar, Stethoscope, AlertCircle } from "lucide-react";

interface ClinicalRecord {
  id: number;
  pet: string;
  owner: string;
  date: string;
  veterinarian: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  medications: string;
  weight: number;
  temperature: number;
}

export function ClinicalRecords() {
  const [records, setRecords] = useState<ClinicalRecord[]>([
    {
      id: 1,
      pet: "Max",
      owner: "Carlos Pérez",
      date: "2024-05-20",
      veterinarian: "Dra. María García",
      diagnosis: "Vacunación anual - Rabia y Parvovirus",
      treatment: "Administración de vacuna antirrábica y parvovirus",
      notes: "Mascota en buen estado de salud. Sin reacciones adversas a la vacunación.",
      medications: "Vacuna antirrábica, Vacuna parvovirus",
      weight: 28.5,
      temperature: 38.2,
    },
    {
      id: 2,
      pet: "Luna",
      owner: "Ana Martínez",
      date: "2024-05-18",
      veterinarian: "Dr. José López",
      diagnosis: "Dermatitis alérgica",
      treatment: "Tratamiento tópico y antihistamínico oral",
      notes: "Presenta irritación en zona abdominal. Se recomienda cambio de alimentación.",
      medications: "Crema cortisona 1%, Antihistamínico oral 5mg cada 12h",
      weight: 4.2,
      temperature: 38.5,
    },
    {
      id: 3,
      pet: "Toby",
      owner: "Luis Ramírez",
      date: "2024-05-15",
      veterinarian: "Dra. Laura Rodríguez",
      diagnosis: "Control de peso y salud dental",
      treatment: "Limpieza dental profesional",
      notes: "Ligero sobrepeso. Se recomienda dieta controlada y más ejercicio.",
      medications: "No aplica",
      weight: 13.2,
      temperature: 38.0,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<ClinicalRecord | null>(null);
  const [formData, setFormData] = useState({
    pet: "",
    owner: "",
    date: "",
    veterinarian: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    medications: "",
    weight: 0,
    temperature: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ClinicalRecord = {
      id: records.length + 1,
      ...formData,
    };
    setRecords([...records, newRecord]);
    setFormData({
      pet: "",
      owner: "",
      date: "",
      veterinarian: "",
      diagnosis: "",
      treatment: "",
      notes: "",
      medications: "",
      weight: 0,
      temperature: 0,
    });
    setShowForm(false);
  };

  const filteredRecords = records.filter(
    (record) =>
      record.pet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2>Expedientes Clínicos</h2>
          <p className="text-muted-foreground">Historial médico completo de las mascotas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Nuevo Expediente
        </button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-lg border border-border mb-6">
          <h3 className="mb-4">Crear Nuevo Expediente Clínico</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block mb-2">Peso (kg)</label>
                <input
                  type="number"
                  required
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="28.5"
                />
              </div>
              <div>
                <label className="block mb-2">Temperatura (°C)</label>
                <input
                  type="number"
                  required
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="38.2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2">Diagnóstico</label>
                <input
                  type="text"
                  required
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Diagnóstico principal"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2">Tratamiento</label>
                <textarea
                  required
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Descripción del tratamiento aplicado"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2">Medicamentos</label>
                <input
                  type="text"
                  required
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Medicamentos recetados"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2">Notas Adicionales</label>
                <textarea
                  required
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Observaciones y recomendaciones"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Guardar Expediente
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
              placeholder="Buscar expediente por mascota, propietario o diagnóstico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="p-6 space-y-4">
          {filteredRecords.map((record) => (
            <div key={record.id} className="bg-muted rounded-lg border border-border overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setSelectedRecord(selectedRecord?.id === record.id ? null : record)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <h4 className="mb-0">{record.pet}</h4>
                      <span className="text-sm text-muted-foreground">- {record.owner}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {record.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Stethoscope className="w-4 h-4" />
                        {record.veterinarian}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm">
                        <strong>Diagnóstico:</strong> {record.diagnosis}
                      </span>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary/80">
                    {selectedRecord?.id === record.id ? "Ocultar" : "Ver detalles"}
                  </button>
                </div>
              </div>

              {selectedRecord?.id === record.id && (
                <div className="p-4 bg-card border-t border-border space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Peso</p>
                      <p>{record.weight} kg</p>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Temperatura</p>
                      <p>{record.temperature} °C</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tratamiento</p>
                    <p className="bg-muted p-3 rounded-lg">{record.treatment}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Medicamentos</p>
                    <p className="bg-muted p-3 rounded-lg">{record.medications}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Notas del Veterinario</p>
                    <div className="bg-muted p-3 rounded-lg flex gap-2">
                      <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p>{record.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
