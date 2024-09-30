import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Product } from "../../../models/product";
import { Router } from "@angular/router";

@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.css']
})
export class ProductCreationComponent implements OnInit {

  productForm: FormGroup;

  // Costruttore con iniezione delle dipendenze necessarie
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Inizializza il form di creazione del prodotto con validazione
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      disponibilita: [0, Validators.required], // Campo numerico
      link: [''], // Campo di selezione per il tipo
    });
  }

  // Metodo chiamato al submit del form
  onSubmit() {
    // Verifica se il form è valido
    if (this.productForm.valid) {
      // Crea un nuovo oggetto prodotto con i dati del form
      const product = new Product(this.productForm.value);

      // Chiama il servizio per creare il prodotto
      this.productService.createProduct(product).subscribe(
        (result: any) => {
          if (result && result.result == 1) {
            alert("Prodotto già presente");
          } else if (result && result.result == 2) {
            alert("Prodotto inserito con successo");
            this.productForm.reset();
          } else {
            alert("Errore nella creazione");
          }
        },
        (error: any) => {
          console.error('Errore durante la creazione del prodotto:', error);
          alert("Errore nella creazione");
        }
      );
    }
  }

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    console.log("Creazione Componente");
  }
}
