import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken'; // Clave para almacenar el token en sessionStorage

  constructor() {}

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
}