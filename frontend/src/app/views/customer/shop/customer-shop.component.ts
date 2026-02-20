import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-shop.component.html',
  styleUrls: ['./customer-shop.component.scss'],
})
export class CustomerShopComponent {
  shops = [
    { id: 1, name: 'ElectroShop Pro', rating: 4.8, products: 250 },
    { id: 2, name: 'Fashion Trends', rating: 4.6, products: 180 },
    { id: 3, name: 'Home Comfort', rating: 4.7, products: 150 },
    { id: 4, name: 'Gourmet Foods', rating: 4.9, products: 320 },
    { id: 5, name: 'Tech World', rating: 4.5, products: 210 },
    { id: 6, name: 'Beauty Plus', rating: 4.4, products: 160 },
    { id: 7, name: 'Sports Gear', rating: 4.7, products: 190 },
    { id: 8, name: 'Book Haven', rating: 4.6, products: 420 },
  ];
}
