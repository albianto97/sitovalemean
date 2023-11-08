export class Product {
  id?: string;
  name: string;
  description: string;
  price: number;

  constructor({ name, description, price }: { name: string, description: string, price: number }) {
    this.name = name;
    this.description = description;
    this.price = price;
  }
}
