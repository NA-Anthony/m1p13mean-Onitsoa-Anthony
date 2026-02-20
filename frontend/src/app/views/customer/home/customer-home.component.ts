import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  category: string;
  discount?: number;
}

interface Shop {
  id: number;
  name: string;
  image: string;
  rating: number;
  productsCount: number;
  description: string;
}

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.scss'],
})
export class CustomerHomeComponent implements OnInit {
  Math = Math;
  featuredProducts: Product[] = [];
  topShops: Shop[] = [];
  categories: any[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Données statiques pour les produits en vedette
    this.featuredProducts = [
      {
        id: 1,
        name: 'Téléphone Smartphone Pro',
        description: 'Dernier modèle avec écran AMOLED',
        price: 899,
        originalPrice: 1099,
        image: 'https://via.placeholder.com/300x300?text=Smartphone',
        rating: 4.8,
        reviews: 324,
        inStock: true,
        category: 'electronique',
        discount: 18,
      },
      {
        id: 2,
        name: 'T-shirt Premium Coton',
        description: 'Confortable et durable',
        price: 29.99,
        originalPrice: 49.99,
        image: 'https://via.placeholder.com/300x300?text=T-shirt',
        rating: 4.5,
        reviews: 156,
        inStock: true,
        category: 'habillement',
      },
      {
        id: 3,
        name: 'Casque Audio Bluetooth',
        description: 'Qualité audio exceptionnelle',
        price: 149.99,
        originalPrice: 249.99,
        image: 'https://via.placeholder.com/300x300?text=Casque',
        rating: 4.7,
        reviews: 892,
        inStock: true,
        category: 'electronique',
        discount: 40,
      },
      {
        id: 4,
        name: 'Lampe LED Intelligente',
        description: 'Contrôle via smartphone',
        price: 49.99,
        originalPrice: 89.99,
        image: 'https://via.placeholder.com/300x300?text=Lampe',
        rating: 4.6,
        reviews: 203,
        inStock: true,
        category: 'maison',
      },
      {
        id: 5,
        name: 'Montre Connectée Fitness',
        description: "Suivi d'activité intégré",
        price: 199.99,
        originalPrice: 299.99,
        image: 'https://via.placeholder.com/300x300?text=Montre',
        rating: 4.4,
        reviews: 567,
        inStock: true,
        category: 'electronique',
        discount: 33,
      },
      {
        id: 6,
        name: 'Jeans Classique Bleu',
        description: 'Coupe tendance et confortable',
        price: 59.99,
        originalPrice: 89.99,
        image: 'https://via.placeholder.com/300x300?text=Jeans',
        rating: 4.3,
        reviews: 445,
        inStock: true,
        category: 'habillement',
        discount: 33,
      },
      {
        id: 7,
        name: 'Chaise Bureau Ergonomique',
        description: 'Soutien lombaire optimal',
        price: 299.99,
        originalPrice: 499.99,
        image: 'https://via.placeholder.com/300x300?text=Chaise',
        rating: 4.9,
        reviews: 234,
        inStock: true,
        category: 'maison',
        discount: 40,
      },
      {
        id: 8,
        name: 'Café Premium Arabica',
        description: 'Grains torréfiés frais',
        price: 14.99,
        originalPrice: 24.99,
        image: 'https://via.placeholder.com/300x300?text=Cafe',
        rating: 4.7,
        reviews: 789,
        inStock: true,
        category: 'alimentaire',
        discount: 40,
      },
    ];

    // Données statiques pour les top boutiques
    this.topShops = [
      {
        id: 1,
        name: 'ElectroShop Pro',
        image: 'https://via.placeholder.com/200x150?text=ElectroShop',
        rating: 4.8,
        productsCount: 250,
        description: 'Meilleurs prix en électronique',
      },
      {
        id: 2,
        name: 'Fashion Trends',
        image: 'https://via.placeholder.com/200x150?text=Fashion',
        rating: 4.6,
        productsCount: 180,
        description: 'Mode et vêtements tendance',
      },
      {
        id: 3,
        name: 'Home Comfort',
        image: 'https://via.placeholder.com/200x150?text=Home',
        rating: 4.7,
        productsCount: 150,
        description: 'Confort et décoration pour la maison',
      },
      {
        id: 4,
        name: 'Gourmet Foods',
        image: 'https://via.placeholder.com/200x150?text=Foods',
        rating: 4.9,
        productsCount: 320,
        description: 'Produits alimentaires de qualité',
      },
    ];

    // Catégories
    this.categories = [
      { id: 1, name: 'Électronique', icon: '📱', count: 450 },
      { id: 2, name: 'Habillement', icon: '👕', count: 890 },
      { id: 3, name: 'Maison', icon: '🏠', count: 320 },
      { id: 4, name: 'Alimentaire', icon: '🍔', count: 560 },
      { id: 5, name: 'Livres', icon: '📚', count: 180 },
      { id: 6, name: 'Beauté', icon: '💄', count: 270 },
    ];
  }

  getDiscountLabel(discount: number | undefined): string {
    return discount ? `-${discount}%` : '';
  }
}
