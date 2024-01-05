enum Status {
    inAttesa = 'In Attesa',
    rifiutato = 'Rifiutato',
    accettato = 'Accettato',
    lavorazione = 'Lavorazione',
    terminato = 'Terminato',
    consegnato = 'Consegnato'
}

export enum OrderType {
    domicilio = 'Domicilio',
    ritiro = 'Ritiro In Negozio'
}

class Product {
    productId: string;
    quantity: number;

    constructor(productId: string, quantity: number) {
        this.productId = productId;
        this.quantity = quantity;
    }
}

export class Order {
    creationDate: Date;
    closingDate?: Date;
    shippingDate?: Date;
    status: Status;
    note?: string;
    orderType?: OrderType;
    products: Product[];
    user: string;

    constructor(creationDate: Date, status: Status, products: Product[], user: string) {
        this.creationDate = creationDate;
        this.status = status;
        this.products = products;
        this.user = user;
    }
}
