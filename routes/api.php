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

Route::post('user/registro-usuario', [\App\Http\Controllers\UserController::class, 'registroUsuario']); //No obliga logear

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);
    Route::put('user/ajustes', [AuthController::class, 'ajustes'])->name('user.ajustes');
    Route::put('user/perfil', [AuthController::class, 'updatePerfil'])->name('user.perfil');
    Route::get('user/listar', [\App\Http\Controllers\UserController::class, 'index'])->name('user.index');
    Route::post('curso/store', [\App\Http\Controllers\CursoController::class, 'store'])->name('curso.crear');
    Route::get('cursos', [\App\Http\Controllers\CursoController::class, 'index'])->name('curso.index');

    Route::get('curso/evaluaciones', [\App\Http\Controllers\CursoController::class, 'evaluaciones'])->name('curso.evaluaciones');

    Route::post('evaluaciones/{curso_id}', [\App\Http\Controllers\EvaluacionController::class, 'store']);
    Route::get('/evaluaciones-estudiantes/{id}/evaluation', [\App\Http\Controllers\EvaluacionController::class, 'getEvaluacion']);
    Route::post('/evaluaciones-estudiantes/{id}/submit-answers', [\App\Http\Controllers\EvaluacionController::class, 'saveAnswers']);

    Route::post('persona/crear', [PersonaController::class, 'store'])->name('persona.store');
    Route::get('persona/{id}', [PersonaController::class, 'show'])->name('persona.show');
    Route::post('persona/{id}', [PersonaController::class, 'update'])->name('persona.update');
    Route::get('estudiantes', [\App\Http\Controllers\EstudianteController::class, 'index'])->name('estudiante.index');
    Route::get('personas', [PersonaController::class, 'index'])->name('persona.index');
    Route::delete('personas/{id}', [PersonaController::class, 'destroy'])->name('persona.destroy');

    Route::get('docentes/listar', [\App\Http\Controllers\UserController::class, 'listarDocentes']);
    Route::get('docente/cursos/{user_id}', [\App\Http\Controllers\UserController::class, 'listarCursosUsuario']);
    Route::get('docente/evaluaciones/{user_id}', [\App\Http\Controllers\UserController::class, 'listarEvaluacionesUsuario']);

});
