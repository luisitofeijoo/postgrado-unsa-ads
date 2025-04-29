<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TipoDocumentoController;
use App\Http\Controllers\ExpedienteController;
use App\Http\Controllers\servicios\ReniecServer;
use App\Http\Controllers\servicios\SunatServer;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\servicios\ApiReniecController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\BienController;
use App\Http\Controllers\MovimientoBienController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login']);
Route::get('/reniec/{dni}', ReniecServer::class)->name('api.reniec');
// Usuario autenticado


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);
    Route::post('user/registro-usuario', [AuthController::class, 'registroUsuario']);
    Route::put('user/ajustes', [AuthController::class, 'ajustes'])->name('user.ajustes');
    Route::put('user/perfil', [AuthController::class, 'updatePerfil'])->name('user.perfil');


    Route::post('persona/crear', [PersonaController::class, 'store'])->name('persona.store');
    Route::get('persona/{id}', [PersonaController::class, 'show'])->name('persona.show');
    Route::post('persona/{id}', [PersonaController::class, 'update'])->name('persona.update');
    Route::get('estudiantes', [\App\Http\Controllers\EstudianteController::class, 'index'])->name('estudiante.index');
    Route::get('personas', [PersonaController::class, 'index'])->name('persona.index');
    Route::delete('personas/{id}', [PersonaController::class, 'destroy'])->name('persona.destroy');
    Route::get('personas/bienes/{dni}', [PersonaController::class, 'bienes'])->name('api.persona.bienes');

    Route::post('bien/registrar-movimiento', [MovimientoBienController::class, 'api_registro_bien_persona'])->name('registro.movimiento.bien');
    Route::post('bienes/registrar-movimiento/', [MovimientoBienController::class, 'api_registro_bienes_persona'])->name('registro.movimiento.bienes');
    Route::get('bien/movimientos', [MovimientoBienController::class, 'api_movimientos'])->name('bien.movimientos');

    Route::delete('movimiento/eliminar/{id}', [MovimientoBienController::class, 'delete'])->name('api.movimiento.eliminar');
    Route::get('movimientos/registros', [MovimientoBienController::class, 'mostrar_registros'])->name('api.movimiento.mostrar_registros');
    Route::post('movimientos/update', [MovimientoBienController::class, 'actualizar_registro'])->name('api.movimiento.actualizar_registro');

    Route::get('/asistencia/guardar/{dni}', [\App\Http\Controllers\AsistenciaController::class, 'save']);
    Route::post('/asistencia/eliminar/{id}', [\App\Http\Controllers\AsistenciaController::class, 'eliminar']);
    Route::get('postulantes', [\App\Http\Controllers\PostulanteController::class, 'index'])->name('postulantes.index');
    Route::get('/reporte/postulantes/user', [\App\Http\Controllers\AsistenciaController::class, 'reporte_postulanteX'])
        ->name('api.asistencia.postulantes.user');
    Route::get('/asistencias/eliminados', [\App\Http\Controllers\AsistenciaController::class, 'reporte_asistencias_deletes'])
        ->name('pua.asistencias.eliminadas');
});
