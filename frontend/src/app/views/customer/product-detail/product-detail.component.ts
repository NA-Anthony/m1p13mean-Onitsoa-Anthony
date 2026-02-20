import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {
  product = {
    id: 1,
    name: 'Produit Détail',
    description: 'Description du produit',
    price: 99.99,
    rating: 4.8,
  };
}
