import { Component, OnInit } from '@angular/core';
import { ChatgptmiapiService } from '../chatgptmiapi.service';
import { ChatResponsesComponent } from '../chat-responses/chat-responses.component'; // Ajusta la ruta según sea necesario
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModule


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ChatResponsesComponent, FormsModule], // Importa el componente aquí
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  currentDate: Date | undefined; 
  responses: any[] = []; 
  roles: string[] = ['Asistente general', 'Asesor técnico', 'Ayuda con tareas'];
  selectedRole: string = ''; 
  sessionStarted: boolean = false; 
  isConversationActive: boolean = false; // Inicializa la propiedad isConversationActive

  constructor(private chatService: ChatgptmiapiService) {}

  ngOnInit(): void {
    this.currentDate = new Date(); 
  }

  startConversation(role: string): void {
    this.selectedRole = role; 
    this.sessionStarted = true; 
  }

  onSubmit(form: any): void {
    const message = form.value.message;

    // Enviar el mensaje con el rol seleccionado
    this.chatService.sendMessage(message).subscribe(response => {
      const newResponse = {
        question: message,
        message: response.choices[0].message.content,
        timestamp: new Date()
      };
      this.responses.push(newResponse);
      form.reset(); 
    });
  }
}
