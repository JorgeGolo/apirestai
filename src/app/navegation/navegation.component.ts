import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navegation',
  standalone: true,
  imports: [],
  templateUrl: './navegation.component.html',
  styleUrl: './navegation.component.css'
})
export class NavegationComponent {
  @Output() documentationSelected = new EventEmitter<void>(); // Definimos el evento

  // Método que se llamará al seleccionar la opción de documentación
  onSelectDocumentation() {
    this.documentationSelected.emit(); // Emitimos el evento
  }
}
