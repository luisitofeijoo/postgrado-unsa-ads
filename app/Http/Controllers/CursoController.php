<?php

namespace App\Http\Controllers;

use App\Models\Curso;
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
        $curso->save();
        return $curso;
    }
}
