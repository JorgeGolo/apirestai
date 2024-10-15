import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';
import { IChat } from '../app.component';
import { AuthService } from '../auth.service'; // Importa el servicio de autenticación
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit {
  @Input() chats: IChat[] = []; // Recibe la lista de chats como IChat[]
  @Output() chatSelected = new EventEmitter<IChat>(); // Emite un IChat cuando se selecciona un chat
  @Output() chatLoaded = new EventEmitter<IChat[]>(); // Emite los chats cuando se carguen

  editingChat: IChat | null = null; // Mantiene el chat en edición
  editName: string = ''; // Nombre temporal para la edición

  constructor(private firestoreService: FirestoreService,
    private authService: AuthService // Inyecta el servicio de autenticación
  ) {}

  async ngOnInit() {
    try {
      this.chats = await this.firestoreService.getChats(); // Llama al servicio para obtener los chats
      console.log('Chats cargados:', this.chats);
      
      // Emitir los chats cuando se carguen
      this.chatLoaded.emit(this.chats);
    } catch (error) {
      console.error('Error al cargar los chats:', error);
    }
  }

  selectChat(chat: IChat) {
    this.chatSelected.emit(chat); // Emitir el chat seleccionado
  }

  removeChat(chat: IChat) {
    const userId = this.authService.getCurrentUserId(); // Obtén el ID del usuario logueado

    // Verifica si el chat pertenece al usuario logueado
    this.firestoreService.deleteChat(chat.id.toString()).then(() => {
      console.log(`Chat con ID ${chat.id} eliminado de Firestore`);
    }).catch((error) => {
      console.error(`Error al eliminar el chat con ID ${chat.id} de Firestore:`, error);
    }).finally(() => {
      // Eliminar de la lista local sí o sí
      this.chats = this.chats.filter(c => c.id !== chat.id);

      // Emitir los chats actualizados
      this.chatLoaded.emit(this.chats);

      console.log(`Chat con ID ${chat.id} eliminado de la lista local`);
    });
  }

  renameChat(chat: IChat) {
    // Guarda el chat en edición y su nombre actual
    this.editingChat = chat;
    this.editName = chat.shortName; // Inicializa el campo con el nombre actual
  }

  saveChatName(chat: IChat) {
    if (this.editingChat) {
      // Actualiza el nombre del chat
      chat.shortName = this.editName;

      // Llama al método del servicio para actualizar en la base de datos
      this.firestoreService.updateChat(chat).then(() => {
        console.log('Nombre del chat actualizado en la base de datos');
      }).catch(error => {
        console.error('Error al actualizar el nombre del chat:', error);
      });

      // Salir del modo edición
      this.editingChat = null;
      this.editName = '';
    }
  }
}