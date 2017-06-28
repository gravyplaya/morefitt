import { Component } from '@angular/core';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-placeholder',
  templateUrl: 'subscribe.html'
})
export class SubscribeComponent {

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private iap: InAppPurchase, private iab: InAppBrowser) {

  }


	subscribenow() {
 			this.iap.getProducts(['AllAccess', 'allaccess'])
					 .then((products) => {
					   console.dir(products);
					       	this.iap.subscribe(products[0].productId)
							  .then(data => this.iap.consume(data.productType, data.receipt, data.signature))
							  .then(() => console.log('product was successfully consumed!'))
							  .catch( err=> console.log(err));
					 })
					 .catch((err) => {
					   console.dir(err);
					 });


	}

	close(){
		this.viewCtrl.dismiss();
	}

	linkTo(link) {
		const browser = this.iab.create(link, '_blank');
		browser.show();
	}
}
