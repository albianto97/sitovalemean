export class Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  disponibilita?: number; // Aggiunto il campo disponibilita
  type?: string; // Aggiunto il campo type

  constructor({_id,name,description,price,disponibilita,type}: {
    _id?: string;
    name: string;
    description: string;
    price: number;
    disponibilita?: number;
    type?: string;
  }) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.disponibilita = disponibilita;
    this.type = type;
  }
}
