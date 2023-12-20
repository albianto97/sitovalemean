export class Product {
  _id?: string; // Aggiunto il campo _id
  name: string;
  description: string;
  price: number;

  constructor({ _id, name, description, price }: { _id?: string, name: string, description: string, price: number }) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.price = price;
  }
}
