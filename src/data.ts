export type Category = 'Shawarma' | 'Pizza' | 'Crispy Chicken' | 'Sides' | 'Menüs' | 'Drinks';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  badge?: string;
  tone: 'gold' | 'red' | 'brown';
};

export type CartItem = Product & { quantity: number };

export type OrderMode = 'Abholung' | 'Lieferung' | 'Vor Ort';

export const images = {
  shawarma: 'https://images.pexels.com/photos/5779364/pexels-photo-5779364.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  shawarmaPlate: 'https://images.pexels.com/photos/37322775/pexels-photo-37322775.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  pizza: 'https://images.pexels.com/photos/365459/pexels-photo-365459.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  pizzaSlice: 'https://images.pexels.com/photos/29605927/pexels-photo-29605927.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  chicken: 'https://images.pexels.com/photos/37228290/pexels-photo-37228290.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  chickenPlate: 'https://images.pexels.com/photos/33068077/pexels-photo-33068077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  fries: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  drink: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

export const products: Product[] = [
  { id: 1, name: 'Classic Shawarma', description: 'Hähnchen, Salat, Tomate, Zwiebel, Sauce', price: 7.9, category: 'Shawarma', image: images.shawarma, tone: 'gold' },
  { id: 2, name: 'TadaaBiss Shawarma', description: 'Extra Fleisch & unsere Spezial-Sauce', price: 8.9, category: 'Shawarma', image: images.shawarma, badge: 'BESTSELLER', tone: 'red' },
  { id: 3, name: 'Spicy Shawarma', description: 'Jalapeños & feurige Sauce', price: 8.5, category: 'Shawarma', image: images.shawarma, tone: 'brown' },
  { id: 4, name: 'Shawarma Teller', description: 'Reis oder Pommes, Salat & Sauce', price: 12.9, category: 'Shawarma', image: images.shawarmaPlate, tone: 'gold' },
  { id: 5, name: 'Margherita', description: 'Tomatensauce, Mozzarella, Basilikum', price: 7.9, category: 'Pizza', image: images.pizza, tone: 'gold' },
  { id: 6, name: 'Salami', description: 'Salami, Mozzarella, Oregano', price: 8.9, category: 'Pizza', image: images.pizza, tone: 'red' },
  { id: 7, name: 'TadaaBiss Special', description: 'Hähnchen, Paprika, Zwiebel, Champignons', price: 10.9, category: 'Pizza', image: images.pizzaSlice, badge: 'NEU', tone: 'red' },
  { id: 8, name: 'Vegetarisch', description: 'Paprika, Zwiebel, Champignons, Oliven', price: 9.9, category: 'Pizza', image: images.pizza, tone: 'brown' },
  { id: 9, name: 'Crispy Bites', description: '5 Stück mit Dip', price: 6.9, category: 'Crispy Chicken', image: images.chicken, tone: 'gold' },
  { id: 10, name: 'Crispy Wings', description: '6 Stück mit Dip', price: 7.9, category: 'Crispy Chicken', image: images.chicken, tone: 'red' },
  { id: 11, name: 'Crispy Box', description: 'Chicken, Pommes, Dip & Salat', price: 11.9, category: 'Crispy Chicken', image: images.chickenPlate, badge: 'BESTSELLER', tone: 'gold' },
  { id: 12, name: 'Crispy Teller', description: 'Chicken, Pommes, Salat & Dip', price: 12.9, category: 'Crispy Chicken', image: images.chickenPlate, tone: 'brown' },
  { id: 13, name: 'Pommes', description: 'Goldbraun & knusprig', price: 3.5, category: 'Sides', image: images.fries, tone: 'gold' },
  { id: 14, name: 'Curly Fries', description: 'Der knusprige Dreh', price: 3.9, category: 'Sides', image: images.fries, tone: 'red' },
  { id: 15, name: 'Mozzarella Sticks', description: '5 Stück, mit Dip', price: 4.9, category: 'Sides', image: images.pizza, tone: 'brown' },
  { id: 16, name: 'Shawarma Menü', description: 'Shawarma, Pommes & Getränk 0,5 l', price: 11.9, category: 'Menüs', image: images.shawarma, badge: 'MEGA DEAL', tone: 'gold' },
  { id: 17, name: 'Pizza Menü', description: 'Pizza, Pommes & Getränk 0,5 l', price: 12.9, category: 'Menüs', image: images.pizza, tone: 'red' },
  { id: 18, name: 'Crispy Menü', description: 'Crispy, Pommes & Getränk 0,5 l', price: 12.9, category: 'Menüs', image: images.chicken, tone: 'brown' },
  { id: 19, name: 'Softdrink', description: 'Coca-Cola, Fanta, Sprite oder Mezzo Mix', price: 2.5, category: 'Drinks', image: images.drink, tone: 'gold' },
  { id: 20, name: 'Ayran', description: 'Erfrischend & cremig, 0,25 l', price: 2, category: 'Drinks', image: images.shawarma, tone: 'red' },
  { id: 21, name: 'Red Bull', description: 'Energy, 0,25 l', price: 3, category: 'Drinks', image: images.chicken, tone: 'brown' },
  { id: 22, name: 'Wasser', description: 'Still oder spritzig, 0,5 l', price: 1.5, category: 'Drinks', image: images.fries, tone: 'gold' },
];

export const categories: Category[] = ['Shawarma', 'Pizza', 'Crispy Chicken', 'Sides', 'Menüs', 'Drinks'];

export const orderModes: { name: OrderMode; icon: string; text: string }[] = [
  { name: 'Abholung', icon: 'PackageCheck', text: 'Schnell abholen & losknuspern' },
  { name: 'Lieferung', icon: 'Truck', text: 'Heiß bis an deine Haustür' },
  { name: 'Vor Ort', icon: 'Utensils', text: 'Frisch genießen bei uns' },
];

export function formatPrice(price: number) {
  return `${price.toFixed(2).replace('.', ',')} €`;
}
