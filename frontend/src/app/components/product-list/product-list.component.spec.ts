import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../core/services/product.service';
import { ReservationService } from '../../core/services/reservation.service';
import { ToastService } from '../../core/services/toast.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let reservationServiceSpy: jasmine.SpyObj<ReservationService>;

  beforeEach(async () => {
    const prodSpy = jasmine.createSpyObj('ProductService', ['getProducts']);
    const resSpy = jasmine.createSpyObj('ReservationService', ['getMyReservations']);

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        ToastService,
        { provide: ProductService, useValue: prodSpy },
        { provide: ReservationService, useValue: resSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    reservationServiceSpy = TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>;
  });

  it('should load products on init', () => {
    const mockProducts = [
      { _id: '1', name: 'Tazza', description: 'Test', stock: 2, reserved: 0 }
    ];
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    reservationServiceSpy.getMyReservations.and.returnValue(of({ products: [] }));

    component.ngOnInit();

    expect(productServiceSpy.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(1);
    expect(component.products[0].name).toBe('Tazza');
  });
});
