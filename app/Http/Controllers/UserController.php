<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(){
        $users = User::query()
            ->latest()
            ->paginate(5)
            ->withQueryString()
            ->through(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at->format('d-m-Y'),
                'roles' => $user->roles()->pluck('name')->toArray() ?? []
    ]);

        return Inertia::render('Pengguna/Index', ['users' => $users]);
    }

    public function create(){
        return Inertia::render('Pengguna/Create', ['roles' => Role::all()->pluck('name')]);
    }

    public function store(Request $request){

        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email:users,email',
            'password' => 'required|string|min:8',
            'roles' => 'array',
            'roles.*' => 'string|exists:roles,name'
        ]);


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        if($request->roles){
            $user->syncRoles($request->roles);
        }

        return redirect()->route('user.index')->with('message','Pengguna berhasil ditambahkan');
    }

        public function edit(User $user){
        return Inertia('Pengguna/Edit', [
            'user' => $user->load('roles'),
            'roles' => Role::all()->pluck('name')
        ]);
    }

    public function update(Request $request, User $user){
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email:users,email' .$user->id,
            'roles' => 'array',
            'roles.*' => 'string|exists:roles,name'
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);
        
        if($request->roles){
            $user->syncRoles($request->roles);
        }

        return redirect()->route('user.index')->with('message', 'Pengguna berhasil diupdate');
    }

    public function destroy(User $user){
        $user->delete();

        return redirect()->route('user.index');
    }
}
