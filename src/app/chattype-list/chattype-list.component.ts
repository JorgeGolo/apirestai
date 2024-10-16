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
}
