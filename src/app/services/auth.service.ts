import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth'; // Asegúrate de importar Auth y User de Firebase

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken'; // Clave para almacenar el token en sessionStorage

  constructor(private auth: Auth) {} // Inyecta el servicio de autenticación

  // Método para iniciar sesión y almacenar el token
  login(token: string): void {
    sessionStorage.setItem(this.tokenKey, token); // Almacena el token en sessionStorage
  }

  // Método para cerrar sesión y eliminar el token
  logout(): void {
    sessionStorage.removeItem(this.tokenKey); // Elimina el token de sessionStorage
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.tokenKey) !== null; // Verifica si hay un token almacenado
  }

  // Método para obtener el token actual (opcional)
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey); // Devuelve el token almacenado
  }

  // Método para obtener el ID del usuario actual
  getCurrentUserId(): string | null {
    const user: User | null = this.auth.currentUser; // Accede al usuario actual
    return user ? user.uid : null; // Devuelve el ID del usuario o null si no está autenticado
  }
}
