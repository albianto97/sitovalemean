export class Notify {
  _id: string;
  username: string;
  notifyDate: Date;
  message: string;
  read: boolean;
  orderId: string;

  constructor(
    username: string,
    notifyDate: Date,
    message: string,
    read: boolean,
    orderId: string,
    id: string
  ) {
    this._id = id;
    this.username = username;
    this.notifyDate = notifyDate;
    this.read = read;
    this.message = message;
    this.orderId = orderId;
  }
}
