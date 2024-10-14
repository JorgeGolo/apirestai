import { Component, OnInit } from '@angular/core';
import { Auth, User, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { CommonModule } from '@angular/common'; 
import { FirestoreService } from '../services/firestore.service'; // Importa tu servicio Firestore
import { IChat } from '../app.component'; // Asegúrate de que la interfaz IChat esté disponible

@Component({
  standalone: true,
  selector: 'app-login-button',
  imports: [CommonModule],
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css']
})
export class LoginButtonComponent implements OnInit {
  
  user: User | null = null;
  chats: IChat[] = []; // Array para almacenar los chats

  constructor(private auth: Auth, private firestoreService: FirestoreService) {}

  ngOnInit() {
    // Detectar el estado de autenticación del usuario
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.user = user; // Si el usuario está logueado, guardamos sus datos
        console.log(user.photoURL);

        // Cargar los chats después de iniciar sesión
        await this.loadChats();
      } else {
        this.user = null; // Si no está logueado, la variable de usuario será nula
        this.chats = []; // Limpiar la lista de chats si no hay usuario
      }
    });
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('Usuario logueado:', result.user);

      // Cargar los chats después del login
      await this.loadChats();
    } catch (error) {
      console.error('Error durante el login:', error);
    }
  }

  logout() {
    this.auth.signOut();
    this.user = null;
    this.chats = []; // Limpiar la lista de chats al cerrar sesión
  }

  // Método para cargar los chats
  async loadChats() {
    try {
      this.chats = await this.firestoreService.getChats(); // Llama a tu servicio para obtener chats
      console.log('Chats cargados:', this.chats);
    } catch (error) {
      console.error('Error al cargar los chats:', error);
    }
  }
}
