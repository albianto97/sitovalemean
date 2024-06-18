import { Ingredient } from "./ingredient";

export interface Stock {
    ingredientId: string;
    movementQuantity: number;
    typeMovement: 'load' | 'unload';
    price: number;
    insertDate: string;
  }
  