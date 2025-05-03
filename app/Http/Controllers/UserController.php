<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\Evaluacion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Yajra\DataTables\Facades\DataTables;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return  Datatables::of(DB::table('users')
            ->leftJoin('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->leftJoin('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->select([
                'users.nro_documento',
                'users.nombres',
                'users.apellidos',
                'users.email',
                'roles.name as role' // Aquí traes el rol
            ])
        )
            ->addIndexColumn()
            ->addColumn('action', fn($row) =>
                //'<a  class="button has-text-black edit-persona is-info is-inline px-2 py-1 mr-1" '.($request->user()->hasRole('admin') ? '': 'disabled').' title="Editar persona"><i class="fas fa-edit"></i></a>'.
                '<a  class="button has-text-black delete-persona is-danger is-inline px-2 py-1" '.($request->user()->hasRole('admin') ? '': 'disabled').' title="Eliminar persona"><i class="fas fa-remove"></i></a>'
            )
            ->filterColumn('nro_documento', function ($query, $keyword) {
                $query->whereRaw("LOWER(users.nro_documento) LIKE ?", ["%$keyword%"]);
            })
            ->filterColumn('nombres', function ($query, $keyword) {
                $query->whereRaw("LOWER(users.nombres) LIKE ?", ["%$keyword%"]);
            })
            ->filterColumn('apellidos', function ($query, $keyword) {
                $query->whereRaw("LOWER(users.apellidos) LIKE ?", ["%$keyword%"]);
            })
            ->filterColumn('role', function ($query, $keyword) {
                $query->whereRaw("LOWER(roles.name) LIKE ?", ["%$keyword%"]);
            })
            ->rawColumns(['action'])
            ->make(true);
    }

    public function listarDocentes() {
        return User::role('docente')->select('id', 'nombres', 'apellidos')->get();
    }

    public function listarCursosUsuario(Request $request) {
        return Curso::where('user_id', $request->user()->id)->get();
    }

    public function listarEvaluacionesUsuario(Request $request) {
        return Evaluacion::with('curso')->where('user_id', $request->user()->id)->orderBy('id', 'desc')->get();
    }


    public function registroUsuario(Request $request) {
        $user =  User::create([
            'nro_documento' => $request->input('nro_documento'),
            'nombres' => $request->input('nombres'),
            'apellidos' => $request->input('apellidos'),
            'email' => $request->input('email'),
            'username' => explode('@', $request->input('email'))[0],
            'password' => Hash::make($request->input('password')),
        ]);

        User::find($user->id)->assignRole($request->input('tipo_usuario'));
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
