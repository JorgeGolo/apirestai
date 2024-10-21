import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IChatConfig } from '../app.component';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chattype-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chattype-list.component.html',
  styleUrl: './chattype-list.component.css'
})
export class ChattypeListComponent {
  @Input() chatconfigs: IChatConfig[] = []; // Recibe la lista de chats como IChat[]
  @Output() chatConfigLoaded = new EventEmitter<IChatConfig[]>(); // Emite los chats cuando se carguen
  @Output() gchattypeSelected = new EventEmitter<void>(); // Definimos el evento

  @Output() chatConfigSelected = new EventEmitter<IChatConfig>(); // Emite los chats cuando se carguen


  constructor(private firestoreService: FirestoreService,
    private authService: AuthService // Inyecta el servicio de autenticación
  ) {}

  async ngOnInit() {
    try {
      this.chatconfigs = await this.firestoreService.getChatConfigs(); // Llama al servicio para obtener los chats
      console.log('Configs cargados:', this.chatconfigs);
      
      // Emitir los chats cuando se carguen
      this.chatConfigLoaded.emit(this.chatconfigs);
    } catch (error) {
      console.error('Error al cargar las configs:', error);
    }
  }

  ongSelectChattype() {
    console.log("list"); // Este mensaje debe aparecer en la consola
    this.gchattypeSelected.emit(); // Emitimos el evento
  }

  clickChatType(chatconfig: IChatConfig) {
    console.log("selected type"); // Este mensaje debe aparecer en la consola
    this.chatConfigSelected.emit(chatconfig); // Emitimos el evento
    
    
  }

  removeChatConfig(chatconfig: IChatConfig) {
    const userId = this.authService.getCurrentUserId(); // Obtén el ID del usuario logueado

    // Verifica si el chat pertenece al usuario logueado
    this.firestoreService.deleteChatConfig(chatconfig.id.toString()).then(() => {
      console.log(`Chat con ID ${chatconfig.id} eliminado de Firestore`);
    }).catch((error) => {
      console.error(`Error al eliminar el chat con ID ${chatconfig.id} de Firestore:`, error);
    }).finally(() => {
      // Eliminar de la lista local sí o sí
      this.chatconfigs = this.chatconfigs.filter(c => c.id !== chatconfig.id);

      // Emitir los chats actualizados
      this.chatConfigLoaded.emit(this.chatconfigs);
    });
  }

  isMouseOverMap: Map<any, boolean> = new Map<any, boolean>(); 
  setMouseOver(chat: any, value: boolean) {
     this.isMouseOverMap.set(chat, value); 
    } 
    isMouseOver(chat: any): boolean {
       return this.isMouseOverMap.get(chat) || false;
    }
}
