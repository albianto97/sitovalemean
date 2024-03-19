import {Component, OnInit} from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Product} from "../../../models/product";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.css']
})
export class ProductCreationComponent implements OnInit{

  productForm: FormGroup;
  constructor(private productService: ProductService, private fb: FormBuilder, private router: Router) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      disponibilita: [0, Validators.required], // Numeric field
      type: ['', Validators.required], // Select field for type
    });
  }


  onSubmit() {
    // Chiamare il servizio per creare il prodotto
    if (this.productForm.valid) {
      // Puoi gestire l'invio del form qui
      console.log('Dati inviati:', this.productForm.value);
      var product = new Product(this.productForm.value);

      this.productService.createProduct(product)
        .subscribe((result: any) => {
          console.log(result.result);
          if (result && result.result == 1) {
            alert("Prodotto già presente");
            this.router.navigate(['/create-product']);
          } else if (result && result.result == 2) {
            console.log(result);
            alert("Prodotto inserito con successo");
            this.router.navigate(['/productList']);
          } else {
            alert("Errore nella creazione");
          }
        });
    }

  }

  ngOnInit(): void {
    console.log("Creazione Componente");
  }
}

