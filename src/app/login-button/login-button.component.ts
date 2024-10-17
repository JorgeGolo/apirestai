import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Auth, User, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { CommonModule } from '@angular/common'; 
import { FirestoreService } from '../services/firestore.service'; // Importa tu servicio Firestore
import { IChat, IChatConfig } from '../app.component';

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
  chatConfigs: IChatConfig[] = [];

  @Output() chatsLoaded = new EventEmitter<IChat[]>(); // Emite los chats cargados
  @Output() chatConfigsLoaded = new EventEmitter<IChatConfig[]>(); // Emite los chats cargados

  @Output() loggedOut = new EventEmitter<void>(); // Emite un evento de logout


  constructor(private auth: Auth, private firestoreService: FirestoreService) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.user = user;
        console.log('Usuario logueado:', user.photoURL);

        // Cargar los chats después de iniciar sesión
        await this.loadChats();
        await this.loadChatConfigs();

      } else {
        this.user = null;
        this.chats = [];
        this.chatConfigs = [];

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
      await this.loadChatConfigs();
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

  async loadChatConfigs() {
    try {
      this.chatConfigs = await this.firestoreService.getChatConfigs();
      console.log('Chats cargados:', this.chats);
      this.chatConfigsLoaded.emit(this.chatConfigs); // Emitir los chats cargados
    } catch (error) {
      console.error('Error al cargar los chats:', error);
    }
  }
  logout() {
    this.auth.signOut().then(() => {
      this.user = null;
      this.chats = []; // Limpia la lista de chats
      this.chatsLoaded.emit(this.chats); // Emite la lista vacía para actualizar la interfaz
      this.chatConfigsLoaded.emit(this.chatConfigs); // Emite la lista vacía para actualizar la interfaz

      this.loggedOut.emit(); // Emitir el evento de logout
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }




}
