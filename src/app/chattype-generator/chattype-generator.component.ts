import { CommonModule } from '@angular/common'; 
import { Component, SimpleChanges, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IChatConfig } from '../app.component';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-chattype-generator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chattype-generator.component.html',
  styleUrls: ['./chattype-generator.component.css']
})
export class ChattypeGeneratorComponent implements OnInit {

  @Output() chatConfigAdded = new EventEmitter<IChatConfig>();
  @Input() chatconfig: IChatConfig | null = null;
  @Input() showedChatConfig: IChatConfig | null = null; // Permitir null

  selectedTypeShortName: string = "Nueva Configuración";
  selectedModelName: string = "gpt-3.5-turbo";
  selectedRoleName: string = "Asistente general";

  models = [
    { id: 0, name: 'gpt-3.5-turbo' },
    { id: 1, name: 'gpt-3.5-turbo-16k' },
    { id: 2, name: 'gpt-4' },
  ];

  constructor(private firestoreService: FirestoreService, private authService: AuthService) {}

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showedChatConfig']) {
      this.initializeForm();
    }
  }

  private initializeForm() {
    if (this.showedChatConfig) {
      this.selectedTypeShortName = this.showedChatConfig.typeShortName || "Nueva Configuración";
      this.selectedModelName = this.showedChatConfig.model || "gpt-3.5-turbo";
      this.selectedRoleName = this.showedChatConfig.role || "Asistente general";
    } else {
      this.selectedTypeShortName = "Nueva Configuración";
      this.selectedModelName = "gpt-3.5-turbo";
      this.selectedRoleName = "Asistente general";
    }
  }

  async saveChatConfig() {
    const newChatConfigData = {
      typeShortName: this.selectedTypeShortName,
      role: this.selectedRoleName,
      model: this.selectedModelName
    };

    try {
      const docRef = await this.firestoreService.addDocument('chatconfigs', newChatConfigData); 
      const newChatConfig: IChatConfig = {
        id: docRef.id,
        typeShortName: this.selectedTypeShortName,
        role: this.selectedRoleName,
        model: this.selectedModelName
      };
      this.chatConfigAdded.emit(newChatConfig);
    } catch (error) {
      console.error('Error al añadir el chat logueado: ', error);
    }
  }
}
