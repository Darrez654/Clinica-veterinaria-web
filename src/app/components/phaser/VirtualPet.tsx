import { useEffect, useRef, useState } from 'react';

/**
 * Componente Phaser - Mascota Virtual Interactiva
 * Muestra una mascota animada que reacciona al mouse/toque
 * Simula un pequeño "tamagotchi" veterinario
 */

type PetMood = 'happy' | 'sad' | 'hungry' | 'sleepy' | 'playful' | 'sick';

interface PetState {
  mood: PetMood;
  hunger: number;
  happiness: number;
  health: number;
}

const moodEmojiMap: Record<PetMood, string> = {
  happy: '🐕✨',
  sad: '🐕💔',
  hungry: '🐕🍖',
  sleepy: '🐕😴',
  playful: '🐕🎾',
  sick: '🐕🤒',
};

const moodLabels: Record<PetMood, string> = {
  happy: 'Feliz 😊',
  sad: 'Triste 😢',
  hungry: 'Hambriento 🍖',
  sleepy: 'Con sueño 😴',
  playful: 'Juguetón 🎾',
  sick: 'Enfermo 🤒',
};

export function VirtualPet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [petState, setPetState] = useState<PetState>({
    mood: 'happy',
    hunger: 80,
    happiness: 70,
    health: 90,
  });

  // Animación con requestAnimationFrame (simulación Phaser-style)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frame = 0;
    let petX = 120;
    let petY = 120;
    let petVx = 1;
    let petVy = 0.5;
    let blinkTimer = 0;
    let tailWag = 0;

    const drawScene = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fondo - pasto
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#d8f3dc');
      gradient.addColorStop(1, '#95d5b2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Césped decorativo
      ctx.fillStyle = '#52b788';
      for (let i = 0; i < 12; i++) {
        const x = (i * 40) + Math.sin(frame * 0.02 + i) * 5;
        const h = 15 + Math.sin(i * 2) * 5;
        ctx.beginPath();
        ctx.ellipse(x, canvas.height - 5, 15, h, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nubes animadas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 3; i++) {
        const cloudX = ((frame * 0.3 + i * 150) % (canvas.width + 100)) - 50;
        const cloudY = 30 + i * 25;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 20, 0, Math.PI * 2);
        ctx.arc(cloudX + 25, cloudY - 5, 15, 0, Math.PI * 2);
        ctx.arc(cloudX + 45, cloudY, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // Movimiento de la mascota
      tailWag = Math.sin(frame * 0.05) * 10;
      blinkTimer++;

      petX += petVx;
      petY += petVy;

      // Rebotar en bordes
      if (petX > canvas.width - 60 || petX < 60) petVx *= -1;
      if (petY > canvas.height - 70 || petY < 60) petVy *= -1;

      // Cuerpo de la mascota (círculo)
      const bodyY = petY + Math.sin(frame * 0.03) * 3;

      // Sombra
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.beginPath();
      ctx.ellipse(petX, bodyY + 45, 35, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cuerpo
      ctx.fillStyle = petState.health > 50 ? '#f4a460' : '#d3d3d3';
      ctx.beginPath();
      ctx.ellipse(petX, bodyY, 35, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Orejas
      ctx.fillStyle = '#f4a460';
      ctx.beginPath();
      ctx.ellipse(petX - 25, bodyY - 20, 10, 15, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(petX + 25, bodyY - 20, 10, 15, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Orejas internas
      ctx.fillStyle = '#deb887';
      ctx.beginPath();
      ctx.ellipse(petX - 25, bodyY - 18, 5, 8, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(petX + 25, bodyY - 18, 5, 8, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Ojos
      const eyeY = bodyY - 5;
      if (blinkTimer % 120 < 10) {
        // Ojos cerrados (parpadeo)
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(petX - 12, eyeY);
        ctx.lineTo(petX - 4, eyeY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(petX + 4, eyeY);
        ctx.lineTo(petX + 12, eyeY);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(petX - 8, eyeY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(petX + 8, eyeY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = petState.mood === 'happy' || petState.mood === 'playful' || petState.mood === 'hungry'
          ? '#2d6a4f' : '#333';
        ctx.beginPath();
        ctx.arc(petX - 6, eyeY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(petX + 10, eyeY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Brillo
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(petX - 7, eyeY - 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(petX + 9, eyeY - 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nariz
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.ellipse(petX, bodyY + 5, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Boca
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1.5;
      const mouthOpen = petState.mood === 'happy' || petState.mood === 'hungry' || petState.mood === 'playful';
      if (mouthOpen) {
        ctx.beginPath();
        ctx.arc(petX, bodyY + 12, 6, 0, Math.PI);
        ctx.stroke();
        ctx.fillStyle = '#ff6b6b';
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(petX, bodyY + 12, 4, 0.1, Math.PI - 0.1);
        ctx.stroke();
      }

      // Cola animada
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(petX + 35, bodyY);
      ctx.quadraticCurveTo(
        petX + 50,
        bodyY - 10 + tailWag,
        petX + 45,
        bodyY - 25 + tailWag
      );
      ctx.stroke();

      // Accesorio según estado
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      if (petState.mood === 'hungry') {
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(petX - 30, bodyY + 10, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#deb887';
        ctx.beginPath();
        ctx.arc(petX - 30, bodyY + 5, 6, 0, Math.PI * 2);
        ctx.fill();
      } else if (petState.mood === 'playful') {
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(petX + 50, bodyY - 5, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      frame++;
      animationId = requestAnimationFrame(drawScene);
    };

    animationId = requestAnimationFrame(drawScene);

    return () => cancelAnimationFrame(animationId);
  }, [petState]);

  // Acciones interactivas
  const feed = () => {
    setPetState(prev => ({
      ...prev,
      mood: 'hungry' as PetMood,
      hunger: Math.min(100, prev.hunger + 15),
      happiness: Math.min(100, prev.happiness + 5),
    }));
    setTimeout(() => setPetState(prev => ({ ...prev, mood: 'happy' as PetMood })), 2000);
  };

  const play = () => {
    setPetState(prev => ({
      ...prev,
      mood: 'playful' as PetMood,
      happiness: Math.min(100, prev.happiness + 20),
      health: Math.min(100, prev.health + 5),
    }));
    setTimeout(() => setPetState(prev => ({ ...prev, mood: 'happy' as PetMood })), 2500);
  };

  const rest = () => {
    setPetState(prev => ({
      ...prev,
      mood: 'sleepy' as PetMood,
      health: Math.min(100, prev.health + 10),
    }));
    setTimeout(() => setPetState(prev => ({ ...prev, mood: 'happy' as PetMood })), 3000);
  };

  const getMoodEmoji = () => moodEmojiMap[petState.mood] || '🐕';

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getMoodEmoji()}</span>
            <div>
              <h4 className="mb-0">Mascota Virtual 🐾</h4>
              <p className="text-xs text-muted-foreground">
                    Estado: {moodLabels[petState.mood]}
                  </p>
                </div>
              </div>
            </div>
          </div>

      <canvas
        ref={canvasRef}
        width={280}
        height={260}
        className="w-full cursor-pointer bg-gradient-to-b from-green-50 to-green-100"
        onClick={play}
      />

      {/* Barras de estado tipo videojuego */}
      <div className="px-4 py-3 space-y-2 bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm w-8">🍖</span>
          <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${petState.hunger}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right">{petState.hunger}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm w-8">😊</span>
          <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${petState.happiness}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right">{petState.happiness}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm w-8">❤️</span>
          <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-red-400 rounded-full transition-all duration-500"
              style={{ width: `${petState.health}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right">{petState.health}%</span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 p-4 pt-2">
        <button
          onClick={feed}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
        >
          🍖 Alimentar
        </button>
        <button
          onClick={play}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
        >
          🎾 Jugar
        </button>
        <button
          onClick={rest}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
        >
          😴 Descansar
        </button>
      </div>
    </div>
  );
}
