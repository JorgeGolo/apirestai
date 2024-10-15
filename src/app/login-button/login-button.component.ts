import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Auth, User, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { CommonModule } from '@angular/common'; 
import { FirestoreService } from '../services/firestore.service'; // Importa tu servicio Firestore
import { IChat } from '../app.component';

@Component({
  standalone: true,
  selector: 'app-login-button',
  imports: [CommonModule],
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css']
})
export class LoginButtonComponent implements OnInit {
  user: User | null = null;
  chats: IChat[] = [];

  @Output() chatsLoaded = new EventEmitter<IChat[]>(); // Emite los chats cargados

  constructor(private auth: Auth, private firestoreService: FirestoreService) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.user = user;
        console.log('Usuario logueado:', user.photoURL);

        // Cargar los chats después de iniciar sesión
        await this.loadChats();
      } else {
        this.user = null;
        this.chats = [];
      }
    });
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('Usuario logueado:', result.user);

      // Cargar los chats después de iniciar sesión
      await this.loadChats();
    } catch (error) {
      console.error('Error durante el login:', error);
    }
  }

  // Método para cargar los chats
  async loadChats() {
    try {
      this.chats = await this.firestoreService.getChats();
      console.log('Chats cargados:', this.chats);
      this.chatsLoaded.emit(this.chats); // Emitir los chats cargados
    } catch (error) {
      console.error('Error al cargar los chats:', error);
    }
  }

  logout() {
    this.auth.signOut().then(() => {
      this.user = null;
      this.chats = []; // Limpia la lista de chats
      this.chatsLoaded.emit(this.chats); // Emite la lista vacía para actualizar la interfaz
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }


}
