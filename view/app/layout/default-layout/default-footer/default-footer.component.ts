import { Component } from '@angular/core';
import { FooterComponent, FooterModule } from '@coreui/angular';

@Component({
    selector: 'app-default-footer',
    templateUrl: './default-footer.component.html',
    styleUrls: ['./default-footer.component.scss'],
    standalone: true,
    imports: [FooterModule]  // ← AJOUTER CETTE LIGNE
})
export class DefaultFooterComponent extends FooterComponent {
  constructor() {
    super();
  }
}