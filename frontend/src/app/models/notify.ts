export class Notify {
  _id?: string;
  username: string;
  message: string;
  orderId: string;

  constructor(
    username: string,
    message: string,
    orderId: string,
    id?: string
  ) {
    this._id = id;
    this.username = username;
    this.message = message;
    this.orderId = orderId;
  }
}
