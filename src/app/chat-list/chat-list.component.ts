import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';
import { IChat } from '../app.component';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit {
  @Input() chats: IChat[] = []; // Recibe la lista de chats como IChat[]
  @Output() chatSelected = new EventEmitter<IChat>(); // Emite un IChat cuando se selecciona un chat
  @Output() chatLoaded = new EventEmitter<IChat[]>(); // Emite los chats cuando se carguen

  constructor(private firestoreService: FirestoreService) {}

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
}