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


Route::get('list/tipo-documentos', [TipoDocumentoController::class, 'index']);
Route::post('expediente/crear', [ExpedienteController::class, 'create'])->name('crear.expediente');


//Server
/*Route::get('/reniec/{dni}', ReniecServer::class)->name('api.reniec');
Route::get('/reniec/test/{dni}', [\App\Http\Controllers\ReniecController::class, 'test'])->name('api.cloud.reniec');
Route::get('/sunat/{ruc}', SunatServer::class)->name('api.sunat');
Route::get('/reniec/{dni}/{server}', [ApiReniecController::class, 'service'])->name('api.service.reniec');*/

/*
 * Intranet
 * */
Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth/google', [GoogleController::class, 'redirectToAuth']);
Route::get('/auth/google/callback', [GoogleController::class, 'handleAuthCallback']);

Route::get('productos/reposiciones/{persona_id}', [\App\Http\Controllers\BienController::class, 'reposiciones']);

Route::get('papeleta/consulta/{dni}', function ($dni) {
    return \App\Models\Persona::where(['nro_documento' => $dni])->first();
});
Route::get('/reniec/{dni}', ReniecServer::class)->name('api.reniec');
// Usuario autenticado


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);
    Route::get('expedientes', [ExpedienteController::class, 'index'])->name('expediente.index');

    Route::get('resumen-comidas/listar',  [\App\Http\Controllers\AsistenciaController::class, 'resumen_comidas_listar']);
    Route::get('registro/comidas-e/{fecha}/{tipo_comida_id}',  [\App\Http\Controllers\AsistenciaController::class, 'reporte_asistencias_comidas']);
    Route::patch('registro/comidas/update/{id}',  [\App\Http\Controllers\AsistenciaController::class, 'update_registro_comidas']);

    Route::get('consumos/prueba/{fecha}/{tipo_comida_id}'  , [\App\Http\Controllers\PersonaController::class, 'listar_estudiantes_para_agregar']);
    Route::post('/registro/comidas/add-personas',  [\App\Http\Controllers\PersonaController::class, 'add_personas_comidas_create']);
    Route::delete('/registro/comidas/eliminar/{id}', [\App\Http\Controllers\AsistenciaController::class, 'registro_comida_eliminar']);

    Route::delete('expediente/delete/{id}', [ExpedienteController::class, 'destroy'])->name('expediente.delete');
    Route::get('expediente/ver/{id}', [ExpedienteController::class, 'show'])->name('expediente.show');
    Route::get('oficinas', [\App\Http\Controllers\OficinaController::class, 'index'])->name('oficina.index');
    Route::delete('oficinas/eliminar/{id}', [\App\Http\Controllers\OficinaController::class, 'destroy'])->name('oficina.destroy');
    Route::post('oficinas/guardar', [\App\Http\Controllers\OficinaController::class, 'store'])->name('oficina.store');
    Route::post('movimiento/expediente/{id}', [\App\Http\Controllers\OficinaController::class, 'movimiento_expediente'])->name('expediente.movimiento');

    Route::put('user/ajustes', [AuthController::class, 'ajustes'])->name('user.ajustes');
    Route::put('user/perfil', [AuthController::class, 'updatePerfil'])->name('user.perfil');
    Route::post('productos/ubicaciones', [\App\Http\Controllers\BienController::class, 'ubicaciones'])->name('ubicacion.index');
    Route::post('persona/crear', [PersonaController::class, 'store'])->name('persona.store');
    Route::get('persona/{id}', [PersonaController::class, 'show'])->name('persona.show');
    Route::post('persona/{id}', [PersonaController::class, 'update'])->name('persona.update');
    Route::get('estudiantes', [\App\Http\Controllers\EstudianteController::class, 'index'])->name('estudiante.index');
    Route::get('personas', [PersonaController::class, 'index'])->name('persona.index');
    Route::delete('personas/{id}', [PersonaController::class, 'destroy'])->name('persona.destroy');
    Route::get('personas/bienes/{dni}', [PersonaController::class, 'bienes'])->name('api.persona.bienes');
    Route::post('producto/crear', [\App\Http\Controllers\BienController::class, 'store'])->name('producto.store');
    Route::get('productos/search', [\App\Http\Controllers\BienController::class, 'search']);
    Route::get('productos', [\App\Http\Controllers\BienController::class, 'index'])->name('producto.index');
    Route::get('productos/{id}', [\App\Http\Controllers\BienController::class, 'show'])->name('producto.show');
    Route::delete('productos/{id}', [\App\Http\Controllers\BienController::class, 'destroy'])->name('producto.destroy');
    Route::post('productos/{id}', [\App\Http\Controllers\BienController::class, 'update'])->name('producto.update');
    Route::post('productos/update/light', [BienController::class, 'updateLight'])->name('producto.update.light');

    Route::get('productos/prestamos/{persona_id}', [\App\Http\Controllers\BienController::class, 'prestamos']);

    Route::post('productos/prestamos/asignar/{persona_id}/{producto_id}', [\App\Http\Controllers\BienController::class, 'asignar_producto']);
    Route::post('productos/registrar/reposicion', [\App\Http\Controllers\BienController::class, 'registrar_reposicion']);
    Route::post('productos/liberar/reposicion', [\App\Http\Controllers\BienController::class, 'liberar_reposicion']);
    Route::post('productos/registro/rapido/{persona_id}', [\App\Http\Controllers\BienController::class, 'registro_rapido_bien'])->name('registro_rapido_bien');
    //Route::post('bienes/registrar-salida/{codigo}', [\App\Http\Controllers\BienController::class, 'registrar_salida'])->name('bienes.registrar_salida');

    //Route::post('persona/bienes/{dni}', [BienController::class, 'api_persona_bienes'])->name('api.persona.bienes');
    //Route::post('bienes/')
    //Route::post('persona/movimiento/registro', [MovimientoBienController::class, 'api_registro_bien'])->name('api.persona.movimiento.registro');
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
