import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { ProductsService } from './providers/products.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private inAppPurchase: InAppPurchase2,
    public productSrv: ProductsService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.refreshAppProducts();
    });
  }

  private refreshAppProducts() {
    this.inAppPurchase.verbosity = this.inAppPurchase.DEBUG;  // for test
    this.productSrv.productIDs.forEach(productId => {
      this.inAppPurchase.register({
        id: productId,
        type: this.inAppPurchase.NON_CONSUMABLE,
        alias: productId
      });
    });
    this.inAppPurchase.refresh();
  }
}
