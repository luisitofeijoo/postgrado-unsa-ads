<?php

namespace App\Http\Controllers;

use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Exception;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GoogleController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Create a new controller instance.
     *
     */
    public function handleGoogleCallback()
    {
        try {
            $user = Socialite::driver('google')->user();
            $finduser = User::where('google_id', $user->id)->first();

            if ($finduser) {
                $token = $finduser->createToken('auth_token')->plainTextToken;
                cookie('token', $token, 60 * 24); // 1 day
            } else {
                $newUser = User::updateOrCreate(['email' => $user->email], [
                    'nombres' => $user->name,
                    'avatar' => $user->avatar,
                    'username' => $user->nickname,
                    'google_id' => $user->id,
                    'password' => encrypt('123456dummy')
                ]);

                $token = $newUser->createToken('auth_token')->plainTextToken;
                cookie('token', $token, 60 * 24); // 1 day
            }


        } catch (Exception $e) {
            dd($e->getMessage());
        }
    }

    public function redirectToAuth() : JsonResponse {
        return response()->json([
            'url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl(),
        ]);
    }

    public function handleAuthCallback(): JsonResponse
    {
        try {

            $socialiteUser = Socialite::driver('google')->stateless()->user();
        } catch (ClientException $e) {
            return response()->json(['error' => 'Invalid credentials provided.'], 422);
        }


        $user = User::query()
            ->firstOrCreate(
                [
                    'email' => $socialiteUser->getEmail(),
                ],
                [
                    'email_verified_at' => now(),
                    'nombres' => $socialiteUser->getName(),
                    'google_id' => $socialiteUser->getId(),
                    'avatar' => $socialiteUser->getAvatar(),
                    'password' => encrypt('123456dummy')
                ]
            );
        $token = $user->createToken('google-token')->plainTextToken;
        $cookie = cookie('token', $token, 60 * 24);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ])->withCookie($cookie);

    /*    return response()->json([
            'user' => $user,
            'access_token' => $user->createToken('google-token')->plainTextToken,
            'token_type' => 'Bearer',
        ]);*/
    }
}
