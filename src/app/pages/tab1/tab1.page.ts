import { Component } from '@angular/core';
import { ProductsService } from '../../providers/products.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public productSrv: ProductsService, public router: Router) {}

  openOrderPage(product: string) {
    this.router.navigate(['/order'], {
      queryParams: { product }
    });
  }
}
