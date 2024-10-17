import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IChatConfig } from '../app.component';
import { FirestoreService } from '../services/firestore.service'; // Importar el servicio de Firestore
import { AuthService } from '../auth.service'; // Asumimos que tienes un servicio para manejar la autenticación

@Component({
  selector: 'app-chattype-generator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chattype-generator.component.html',
  styleUrl: './chattype-generator.component.css'
})
export class ChattypeGeneratorComponent {

  @Output() chatConfigAdded = new EventEmitter<IChatConfig>(); // Asegúrate de que el tipo sea IChat


  chatconfigs: IChatConfig[] = []; // Usar la interfaz IChat

  selectedTypeShortName: string = "Nueva Configuración"; // Para almacenar el nombre del modelo seleccionado
  selectedModelName: string = "gpt-3.5-turbo"; // Para almacenar el nombre del modelo seleccionado
  selectedRoleName: string = "Asistente general"; // Para almacenar el nombre del rol seleccionado

  constructor(private firestoreService: FirestoreService, private authService: AuthService) { }


  models = [
    { id: 0, name: 'gpt-3.5-turbo' },  // Modelo económico y rápido, adecuado para muchas tareas generales
    { id: 1, name: 'gpt-3.5-turbo-16k' },  // Modelo con un contexto mayor, ideal para tareas más largas
    { id: 2, name: 'gpt-4' },  // Modelo más avanzado, pero más costoso que gpt-3.5
  ];

  async saveChatConfig(){
    const newChatConfigData = {
      typeShortName : this.selectedTypeShortName,
      role: this.selectedRoleName,
      model: this.selectedModelName
     };

    try {
      const docRef = await this.firestoreService.addDocument('chatconfigs', newChatConfigData); 
      const newChatConfig : IChatConfig = {
        id : docRef.id,
        typeShortName : this.selectedTypeShortName,
        role: this.selectedRoleName,
        model: this.selectedModelName
       };
       this.chatConfigAdded.emit(newChatConfig); // Emitir el nuevo chat
        // Actualiza la lista local de chats
        this.chatconfigs.push(newChatConfig); 
        this.chatconfigs = await this.firestoreService.getChatConfigs(); 

    }
    catch (error) {
      console.error('Error al añadir el chat logueado: ', error);
    }
  }

}
