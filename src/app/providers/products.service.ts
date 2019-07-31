import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  productIDs = ['product_1', 'product_2', 'product_3'];

  constructor() {
    console.log('Init ProductService');
  }
}
