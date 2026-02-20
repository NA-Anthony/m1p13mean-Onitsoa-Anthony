import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-products.component.html',
  styleUrls: ['./customer-products.component.scss'],
})
export class CustomerProductsComponent {
  products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Produit ${i + 1}`,
    price: Math.floor(Math.random() * 500) + 10,
    originalPrice: Math.floor(Math.random() * 700) + 100,
    rating: (Math.random() * 2 + 3).toFixed(1),
  }));
}
