import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAPError, IAPProduct, IAPQueryCallback, InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { LoadingController, Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  product: IAPProduct;

  constructor(
    private route: ActivatedRoute,
    private platform: Platform,
    public toastCtrl: ToastController,
    private inAppPurchase: InAppPurchase2,
    public loadingCtrl: LoadingController
  ) {
  }

  ngOnInit() {
    console.log('Init OrderPage');
  }

  async ionViewWillEnter() {
    console.log('ionViewWillEnter');
    if (!this.platform.is('cordova')) {
      return;
    }
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.inAppPurchase.ready((status) => {
      console.log('Store is Ready: ' + JSON.stringify(status));
      this.initProductListeners();
      loading.dismiss();
    });
  }

  private initProductListeners() {
    const productId = this.route.snapshot.queryParamMap.get('product');

    console.log(JSON.stringify(this.inAppPurchase.get(productId)));
    console.log('Products: ' + JSON.stringify(this.inAppPurchase.products));

    this.inAppPurchase.when(productId).approved(this.onProductApproved);

    this.inAppPurchase.when(productId).cancelled(this.onProductCancelled);

    this.inAppPurchase.when(productId).error(this.onProductError);

    this.inAppPurchase.when(productId).updated(this.onProductUpdated);

    this.refreshProduct(this.inAppPurchase.get(productId));
  }

  private refreshProduct(product: IAPProduct) {
    console.log('refreshProduct', JSON.stringify(product));

    if (!!product.id && !!product.priceMicros) {
      this.product = product;
    }
  }

  async buy(product: IAPProduct) {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    try {
      const data = await this.inAppPurchase.order(product.id);
      console.log('order success : ' + JSON.stringify(data));
    } catch (err) {
      console.log('order error : ' + JSON.stringify(err));
      this.showUnexpectedErrorMessage(err);
    }
    loading.dismiss();
  }

  onProductApproved(product: IAPProduct) {
    console.log('onProductApproved', product);
    // Verify the transaction data on the backend
    this.showSuccessPurchaseMessage(product);
    product.finish();
  }

  onProductCancelled(product: IAPProduct) {
    console.log('onProductCancelled', product);
    this.showCanceledPurchaseMessage(product);
  }

  onProductError(error: IAPError) {
    console.log('onProductError', error);
    this.showUnexpectedErrorMessage(error);
  }

  onProductUpdated(product: IAPProduct) {
    console.log('onProductUpdated', product);
    this.refreshProduct(product);
  }

  private async showSuccessPurchaseMessage(product: IAPProduct) {
    const toast = await this.toastCtrl.create({
      message: 'SUCCESS: ' + JSON.stringify(product),
      duration: 5000
    });
    toast.present();
  }

  private async showUnexpectedErrorMessage(error) {
    const toast = await this.toastCtrl.create({
      message: 'ERROR: ' + JSON.stringify(error),
      duration: 5000
    });
    toast.present();
  }

  private async showCanceledPurchaseMessage(product: IAPProduct) {
    const toast = await this.toastCtrl.create({
      message: 'CANCEL: ' + JSON.stringify(product),
      duration: 5000
    });
    toast.present();
  }

  ionViewDidLeave() {
    this.inAppPurchase.off(this.onProductApproved);
    this.inAppPurchase.off(this.onProductCancelled);
    this.inAppPurchase.off(this.onProductError);
    this.inAppPurchase.off(this.onProductUpdated);
  }

}
