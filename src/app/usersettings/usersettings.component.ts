import { Component, EventEmitter, Output } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { IChat } from '../app.component';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-usersettings',
  standalone: true,
  imports: [],
  templateUrl: './usersettings.component.html',
  styleUrl: './usersettings.component.css'
})

export class UsersettingsComponent {
  user: User | null = null;
  chats: IChat[] = [];
  @Output() chatsLoaded = new EventEmitter<IChat[]>(); // Emite los chats cargados
  @Output() loggedOut = new EventEmitter<void>(); // Emite un evento de logout


  constructor(private auth: Auth, private firestoreService: FirestoreService){}

  ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.user = user;
        //console.log('Usuario logueado:', user.photoURL);

        // Cargar los chats después de iniciar sesión
        await this.loadChats();

      } else {
        this.user = null;
        this.chats = [];

      }
    });
  }
  // Método para cargar los chats
  async loadChats() {
    try {
      this.chats = await this.firestoreService.getChats();
      //console.log('Chats cargados:', this.chats);
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

      this.loggedOut.emit(); // Emitir el evento de logout

    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }

}
