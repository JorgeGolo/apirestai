import { Component, EventEmitter, Output, Input, SimpleChanges, OnInit  } from '@angular/core';
import { ChatComponent } from '../chat/chat.component'; // Asegúrate de importar el componente correctamente
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatListComponent } from '../chat-list/chat-list.component'; // Asegúrate de importar ChatListComponent

import { FirestoreService } from '../services/firestore.service'; // Importar el servicio de Firestore
import { AuthService } from '../services/auth.service'; // Asumimos que tienes un servicio para manejar la autenticación
import { IChat } from '../app.component';

import { GroqService } from '../services/groq.service';


@Component({
  selector: 'app-chat-generator',
  templateUrl: './chat-generator.component.html',
  styleUrls: ['./chat-generator.component.css'],
  standalone: true,
  imports: [ChatListComponent, ChatComponent, CommonModule, FormsModule], // Asegúrate de importar el componente aquí
})
export class ChatGeneratorComponent implements OnInit {
  
  @Input() editingChat: IChat | null = null; // Recibe el chat en edición


  @Output() chatAdded = new EventEmitter<IChat>(); // Asegúrate de que el tipo sea IChat
  @Output() chatSelected = new EventEmitter<IChat>(); // Emite un IChat cuando se selecciona un chat
  @Output() chatUpdated = new EventEmitter<IChat>(); // Nuevo evento para emitir actualizaciones de chat

  chats: IChat[] = []; // Usar la interfaz IChat
  chatCounter = 0; // Contador de chats creados

  selectedChatConfig: string = ""; // Para almacenar el nombre del modelo seleccionado
  selectedModelName: string = ""; // Para almacenar el nombre del modelo seleccionado
  selectedRoleName: string = ""; // Para almacenar el nombre del rol seleccionado
  selectedShortName: string = "";

  onclicksubmit: boolean = false;


  rolesystem = [
    { id: 0, name: 'Asistente general' },
    { id: 1, name: 'Dime una receta que incluya este ingrediente' },
    { id: 2, name: 'Traduce todo lo que te diga al inglés' },
    // Agrega más roles según sea necesario
  ];



  constructor(private firestoreService: FirestoreService, 
    private authService: AuthService,
    private groqService: GroqService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editingChat'] && this.editingChat) {
      // Asigna los valores del chat en edición a los campos
      this.selectedShortName = this.editingChat.shortName || 'Nuevo Chat';
      this.selectedModelName = this.editingChat.model || '';
      this.selectedRoleName = this.editingChat.role || '';
    }
  }

  models = [
    { id: 0, name: 'gpt-3.5-turbo' },  // Modelo económico y rápido, adecuado para muchas tareas generales
    { id: 1, name: 'gpt-3.5-turbo-16k' },  // Modelo con un contexto mayor, ideal para tareas más largas
    { id: 2, name: 'gpt-4' },  // Modelo más avanzado, pero más costoso que gpt-3.5
  ];

  groqModels: { id: number, name: string }[] = [];

  async ngOnInit() {
    try {
      this.onclicksubmit = false;
      this.groqModels = await this.groqService.getModels();
      console.log('Modelos obtenidos de Groq:', this.groqModels);
    } catch (error) {
      console.error('Error al obtener modelos de Groq:', error);
    }
  }

  async addChat() {
    this.onclicksubmit = true;
  
    if (!this.selectedModelName) {
      console.error('Por favor, selecciona una configuración válida.');
      return; // Evita que se procese si no hay configuración seleccionada
    }
  
    const userId = this.authService.getCurrentUserId() || undefined;
    const chatData = {
      role: this.selectedRoleName,
      model: this.selectedModelName,
      shortName: this.selectedShortName,
      memory: null,
      responses: []
    };
  
    try {
      if (this.editingChat) {
        // Actualizar el chat existente
        await this.firestoreService.updateDocument('chats', this.editingChat.id, chatData);
  
        this.editingChat.role = this.selectedRoleName;
        this.editingChat.model = this.selectedModelName;
        this.editingChat.shortName = this.selectedShortName;
  
        this.chatUpdated.emit(this.editingChat); // Emitir el chat actualizado
        console.log('Chat actualizado:', this.editingChat);
        this.chatSelected.emit(this.editingChat); // Emitir el chat seleccionado

      } else {
        // Crear un nuevo chat
        const docRef = await this.firestoreService.addDocument('chats', chatData, userId);
  
        const newChat: IChat = {
          id: docRef.id,
          userId: userId,
          role: this.selectedRoleName,
          model: this.selectedModelName,
          shortName: this.selectedShortName,
          memory: null,
          responses: []
        };
  
        this.chatAdded.emit(newChat); // Emitir el nuevo chat
        this.chatCounter++;
        this.chats.push(newChat); // Agregar el nuevo chat a la lista local
        this.resetForm();

        this.chatSelected.emit(newChat); // Emitir el chat seleccionado
      }
  
      // (Opcional) Refresca la lista de chats locales
      this.chats = await this.firestoreService.getChats();
  
    } catch (error) {
      console.error('Error al añadir/actualizar el chat: ', error);
  
      const fallbackChat: IChat = {
        id: Date.now().toString(), // Asigna un ID único temporal
        userId: userId || '',
        role: this.selectedRoleName,
        model: this.selectedModelName,
        shortName: this.selectedShortName,
        memory: null,
        responses: []
      };
  
      this.chatAdded.emit(fallbackChat); // Emitir el chat alternativo
      this.chatCounter++;
      this.chats.push(fallbackChat); // Agregar el chat alternativo a la lista local
    }
  }
  // Restablecer formulario para preparar la creación o edición de un nuevo chat
  resetForm() {
    this.selectedShortName = 'Nuevo Chat';
    this.selectedModelName = '';
    this.selectedRoleName = '';
    this.editingChat = null;
    this.onclicksubmit = false;
  }

  
}
