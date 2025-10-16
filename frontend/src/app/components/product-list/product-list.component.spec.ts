import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, Product } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch product list', () => {
    const dummyProducts: Product[] = [
      { _id: '1', name: 'Tazza', description: 'Ceramica', stock: 5 },
      { _id: '2', name: 'Lampada', description: 'LED', stock: 3 }
    ];

    service.getProducts().subscribe((res) => {
      expect(res.length).toBe(2);
      expect(res[0].name).toBe('Tazza');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should create product', () => {
    const newProduct: Product = { name: 'Libro', description: 'Romanzo', stock: 10 };

    service.createProduct(newProduct).subscribe((res) => {
      expect(res.name).toBe('Libro');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ ...newProduct, _id: '123' });
  });
});
