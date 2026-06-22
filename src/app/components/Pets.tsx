import { useState } from "react";
import { PawPrint, Search, User, Calendar } from "lucide-react";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  owner: string;
  registrationDate: string;
  color: string;
}

export function Pets() {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: 1,
      name: "Max",
      species: "Perro",
      breed: "Golden Retriever",
      age: 3,
      weight: 28.5,
      owner: "Carlos Pérez",
      registrationDate: "2024-01-20",
      color: "Dorado",
    },
    {
      id: 2,
      name: "Luna",
      species: "Gato",
      breed: "Siamés",
      age: 2,
      weight: 4.2,
      owner: "Ana Martínez",
      registrationDate: "2024-02-15",
      color: "Crema con puntos oscuros",
    },
    {
      id: 3,
      name: "Toby",
      species: "Perro",
      breed: "Beagle",
      age: 5,
      weight: 12.8,
      owner: "Luis Ramírez",
      registrationDate: "2024-03-05",
      color: "Tricolor",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: 0,
    weight: 0,
    owner: "",
    color: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPet: Pet = {
      id: pets.length + 1,
      ...formData,
      registrationDate: new Date().toISOString().split("T")[0],
    };
    setPets([...pets, newPet]);
    setFormData({ name: "", species: "", breed: "", age: 0, weight: 0, owner: "", color: "" });
    setShowForm(false);
  };

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2>Gestión de Mascotas</h2>
          <p className="text-muted-foreground">Registra y administra las mascotas de la clínica</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <PawPrint className="w-5 h-5" />
          Nueva Mascota
        </button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-lg border border-border mb-6">
          <h3 className="mb-4">Registrar Nueva Mascota</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Max"
                />
              </div>
              <div>
                <label className="block mb-2">Especie</label>
                <select
                  required
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Conejo">Conejo</option>
                  <option value="Reptil">Reptil</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Raza</label>
                <input
                  type="text"
                  required
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Golden Retriever"
                />
              </div>
              <div>
                <label className="block mb-2">Edad (años)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block mb-2">Peso (kg)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="28.5"
                />
              </div>
              <div>
                <label className="block mb-2">Color</label>
                <input
                  type="text"
                  required
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Dorado"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
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
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Guardar Mascota
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
              placeholder="Buscar mascota por nombre, propietario o especie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="bg-muted p-6 rounded-lg border border-border hover:border-primary transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <PawPrint className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="mb-0">{pet.name}</h4>
                    <p className="text-sm text-muted-foreground">{pet.species}</p>
                  </div>
                </div>
                <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs">
                  {pet.age} años
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Raza:</span>
                  <span>{pet.breed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color:</span>
                  <span>{pet.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peso:</span>
                  <span>{pet.weight} kg</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{pet.owner}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>Reg: {pet.registrationDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
