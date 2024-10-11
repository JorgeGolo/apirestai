import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule

import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ChatgptmiapiService } from './chatgptmiapi.service'; // Asegúrate de importar tu servicio
import { ChatResponsesComponent } from './chat-responses/chat-responses.component';

// Definición de la interfaz
interface IChatResponse {
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-root',
  standalone: true,
  //imports: [RouterOutlet],
  imports: [RouterOutlet, FormsModule, CommonModule, ChatResponsesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Cambiado de styleUrl a styleUrls
})
export class AppComponent {
  title = 'apirestai';
  //response: string | undefined; // Variable para almacenar la respuesta de la API
  //responses: string[] = []; // Array para almacenar todas las respuestas

  responses: IChatResponse[] = []; // Array para almacenar las respuestas y sus fechas


  constructor(private chatgptService: ChatgptmiapiService) {} // Inyección del servicio

  onSubmit(form: any) { // Asegúrate de que el método reciba el formulario
    const message = form.value.message; // Obtiene el mensaje del formulario
    this.chatgptService.sendMessage(message).subscribe(response => {
      
      // Agregar la nueva respuesta al array
      //this.responses.push(response.choices[0].message.content);

      // Uso de la interfaz
      const newResponse: IChatResponse = {
        message: response.choices[0].message.content,
        timestamp: new Date() // Fecha y hora actuales
      };
      this.responses.push(newResponse); // Agregar al array
    });
  }
}
