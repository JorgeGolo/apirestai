import { Component, OnInit } from '@angular/core';
import { Auth, User, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  standalone: true,
  selector: 'app-login-button',
  imports: [CommonModule],  // Asegúrate de que CommonModule esté aquí
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css']
})
export class LoginButtonComponent implements OnInit {
  user: User | null = null;

  constructor(private auth: Auth) {}

  ngOnInit() {
    // Detectar el estado de autenticación del usuario
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user; // Si el usuario está logueado, guardamos sus datos
        
        console.log(user.photoURL);
      } else {
        this.user = null; // Si no está logueado, la variable de usuario será nula
      }
    });
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('Usuario logueado:', result.user);
    } catch (error) {
      console.error('Error durante el login:', error);
    }
  }

  logout() {
    this.auth.signOut();
    this.user = null;
  }
}
