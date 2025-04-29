<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Sleep;

class AuthController extends Controller
{
    // login a user method
    public function login(Request $request) {
        $user = User::where('email', $request->input('username'))->
                    orWhere('username', $request->input('username'))
                    ->first();

        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'message' => 'El nombre de usuario o contraseña es incorrecto.',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $cookie = cookie('token', $token, 60 * 8000); // 1 day

        return response()->json([
            'user' => $user,
            'token' => $token,
        ])->withCookie($cookie);

    }


    // logout a user method
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        $cookie = cookie()->forget('token');

        return response()->json([
            'message' => 'Logged out successfully!'
        ])->withCookie($cookie);
    }

    // get the authenticated user method
    public function user(Request $request) {
        return response()->json([
            'user' => new UserResource($request->user())
        ]);
    }

    public function ajustes(Request $request) {

        $userData = ['username' => $request->input('username')];

        if (!empty($request->input('password'))) {
            $userData['password'] = Hash::make($request->input('password'));
        }

        $request->user()->update($userData);

        return $request->user();
    }

    public function updatePerfil(Request $request) {
        $request->user()->update([
           'nombres' => $request->input('nombres'),
           'apellidos' => $request->input('apellidos'),
           'avatar' => $request->input('avatar')
        ]);

        return $request->user();
    }
}
