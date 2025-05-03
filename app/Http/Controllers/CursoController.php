<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\Evaluacion;
use Illuminate\Http\Request;

class CursoController extends Controller
{
    public function index() {
        $cursos = Curso::orderBy ('id', 'desc')->get();
        return $cursos;
    }
    public function store(Request $request){
        $curso = new Curso();
        $curso->nombre_curso = $request->input('nombre_curso');
        $curso->user_id = $request->input('user_id');
        $curso->creditos = $request->input('creditos');
        $curso->save();
        return $curso;
    }
    public function evaluaciones() {
        return Evaluacion::with('curso')->orderBy('id', 'desc')->get();
    }
}
