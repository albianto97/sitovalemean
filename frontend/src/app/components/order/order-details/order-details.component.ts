import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, Status } from 'src/app/models/order';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})

export class OrderDetailsComponent implements OnInit {
[x: string]: any;
  order: any;
  orderStates: string[] = [];
  constructor(private route: ActivatedRoute) { }
  ngOnInit(): void {
    const state = history.state;
    if (state && state.order) {
      this.order = state.order;
    }
console.log(this.order);

    this.orderStates =  Object.keys(Status);

  }
}
