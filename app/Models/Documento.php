<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Documento extends Model
{
    use HasFactory;

    protected $table = 'documentos';

    protected $fillable = [
        'mascota_id',
        'registro_clinico_id',
        'usuario_id',
        'nombre_original',
        'nombre_archivo',
        'ruta',
        'tipo',
        'tamaño',
    ];

    // Relación: Documento → Mascota
    public function mascota(): BelongsTo
    {
        return $this->belongsTo(Mascota::class);
    }

    // Relación: Documento → RegistroClínico (opcional)
    public function registroClinico(): BelongsTo
    {
        return $this->belongsTo(RegistroClinico::class);
    }

    // Relación: Documento → Usuario (quien subió el archivo)
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }
}
