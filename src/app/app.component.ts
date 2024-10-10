import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule

import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ChatgptmiapiService } from './chatgptmiapi.service'; // Asegúrate de importar tu servicio


@Component({
  selector: 'app-root',
  standalone: true,
  //imports: [RouterOutlet],
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Cambiado de styleUrl a styleUrls
})
export class AppComponent {
  title = 'apirestai';
  response: string | undefined; // Variable para almacenar la respuesta de la API

  constructor(private chatgptService: ChatgptmiapiService) {} // Inyección del servicio

  onSubmit(form: any) { // Asegúrate de que el método reciba el formulario
    const message = form.value.message; // Obtiene el mensaje del formulario
    this.chatgptService.sendMessage(message).subscribe({
      next: (data) => {
        this.response = data.choices[0].message.content; // Ajusta esto según la respuesta de tu API
      },
      error: (error) => {
        console.error('Error al enviar el mensaje:', error);
        this.response = 'Hubo un error al procesar tu solicitud.';
      }
    });
  }
}