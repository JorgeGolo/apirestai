import { Injectable } from '@angular/core';
import { IChat } from '../app.component'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root',
})
export class InitialDataService {
  constructor() {}

  // Método para obtener los datos iniciales
  getInitialChats(): IChat[] {
    return [
      {
        id: '1',
        userId: undefined,
        role: 'Asistente general',
        model: 'gpt-3.5-turbo',
        shortName: 'Demo Chat',
        memory: null,
        responses: [
          {
            id: 'response1',
            message: 'Escribe preguntas en este chat, o bien crea uno personalizado',
            timestamp: new Date(),
            question: '¿Cómo empezar a usar esta app?',
          },
        ],
      },
    ];
  }
}
