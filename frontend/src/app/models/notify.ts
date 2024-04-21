export class Notify {
  _id?: string;
  username: string;
  notifyDate: Date;
  message: string;
  orderId: string;

  constructor(
    username: string,
    notifyDate: Date,
    message: string,
    orderId: string,
    id?: string
  ) {
    this._id = id;
    this.username = username;
    this.notifyDate = notifyDate;
    this.message = message;
    this.orderId = orderId;
  }
}
