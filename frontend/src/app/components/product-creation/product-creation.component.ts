import {Component, OnInit} from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Product} from "../../models/product";

@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.css']
})
export class ProductCreationComponent implements OnInit{

  productForm: FormGroup;
  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0 , Validators.required]
    });

  }


  onSubmit() {
    // Chiamare il servizio per creare il prodotto
    if (this.productForm.valid) {
      // Puoi gestire l'invio del form qui
      console.log('Dati inviati:', this.productForm.value);
      var product = new Product(this.productForm.value);
      console.log(product);
      this.productService.createProduct(product)
        .subscribe((result: any) => {
          console.log(result);
        })
    }
  }

  ngOnInit(): void {
    console.log("Creazione Componente");
  }
}

