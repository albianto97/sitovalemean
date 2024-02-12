export class Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  disponibilita?: number; // Aggiunto il campo disponibilita
  type?: string; // Aggiunto il campo type
  count? : number;
  quantity? : number;

  constructor({_id,name,description,price,disponibilita,type, count, quantity}: {
    _id?: string;
    name: string;
    description: string;
    price: number;
    disponibilita?: number;
    type?: string;
    count?: number;
    quantity?: number;
  }) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.disponibilita = disponibilita;
    this.type = type;
    this.count = count;
    this.quantity = quantity;
  }
}
