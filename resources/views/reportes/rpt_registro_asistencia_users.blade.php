@extends('layouts.app')
@section('content')
    <br>
    <div class="container">
        <a href="javascript:history.back()"><i class="far fa-arrow-left"></i> <strong><u>Regresar</u></strong></a>
        <h1 class="is-size-4">Control de registro de usuarios</h1>
        <table class="table has-text-centered is-fullwidth is-bordered">
            <thead>
            <tr>
                <td></td><td><strong>Usuario</strong></td><td class="has-text-centere"><strong> Postulantes registrados</strong></td>
            </tr>
            </thead>
            <tbody>
            @foreach($users_asistencias as $index => $r)
                <tr>
                    <td>{{ ++$index }}</td>
                    <td>{{ $r->nombres }}</td>
                    <td>{{ $r->registrados }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
@endsection
