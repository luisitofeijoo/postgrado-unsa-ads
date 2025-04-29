<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class PostulanteController extends Controller
{
    public function index()
    {
        return DataTables::of(DB::table('postulantes'))
            ->rawColumns(['action'])
            ->make(true);
    }
}
