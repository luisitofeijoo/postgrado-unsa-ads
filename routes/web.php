<?php

use App\Models\Prestamo;
use App\Models\Bien;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\BienController;
use App\Http\Controllers\MesaVirtualController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\AuthController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('reniec/{dni}', function ($dni) {
    $url = 'https://backend.pais.gob.pe:8076/api/v1/partner/reniec/public/consultaDNI/'.$dni;
    return Http::post($url)->json();
});

Route::view('/{patch}', 'home')
    ->where('patch', '^(?!api).*'); // Evita que capture rutas que comienzan con "api"
