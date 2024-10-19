import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { IChat } from '../app.component'; // Importa la interfaz IChat desde el componente principal
import { ChatTitleComponent } from '../chat-title/chat-title.component'; // Asegúrate de importar el componente
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar *ngIf, *ngFor, etc.
import { ChatResponsesComponent } from '../chat-responses/chat-responses.component'; // Asegúrate de importar el componente
import { ChatComponent } from '../chat/chat.component'; // Asegúrate de importar el componente

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [ChatComponent, ChatResponsesComponent, CommonModule, ChatTitleComponent],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css'
})
export class ChatContainerComponent {
  @Input() selectedChat: IChat | null = null;  // Aceptar null

  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;
  @ViewChild('chat', { static: false }) chat!: ElementRef;  // Referencia al componente <app-chat>


  ngAfterViewChecked() {
    this.scrollToChat();
  }

  // Detecta cambios en selectedChat y ejecuta el scroll
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedChat']) {
      this.scrollToChat();
    }
  }

  // Función para hacer scroll hasta el componente <app-chat>
  scrollToChat(): void {
    try {
      if (this.chat) {
        // Desplaza hasta el componente <app-chat>
        this.chat.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        console.log('Scrolled to app-chat');
      } else {
        console.error('chat es undefined');
      }
    } catch (err) {
      console.error('Error haciendo scroll hacia app-chat:', err);
    }
  }

}
