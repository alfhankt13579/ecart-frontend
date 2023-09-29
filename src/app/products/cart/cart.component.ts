import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  name: string = '';
  houseNumber: string = '';
  streetName: string = '';
  state: string = '';
  pincode: string = '';
  mobileNumber: string = '';
  proceedToPayment: boolean = false;
  offerClicked: boolean = false;
  discountStatus: boolean = false;
  allCarts: any = [];
  cartTotalPrice = 0;
  offerTotalPrice = 0;
  public payPalConfig?: IPayPalConfig;
  showSuccess: any = '';
  showPaypalButton: boolean = false;

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.api.viewCart().subscribe(
      (result: any) => {
        console.log(result);
        this.allCarts = result;
        this.getCartTotal();
      },
      (result: any) => {
        console.log(result.error);
      }
    );
    this.initConfig();
  }

  deleteCartItem(id: any) {
    this.api.deleteCartProduct(id).subscribe(
      (result: any) => {
        console.log(result);
        this.allCarts = result;
        alert('Product has been removed');
        this.api.cartCount();
        this.getCartTotal();
      },
      (result: any) => {
        console.log(result.error);
      }
    );
  }

  getCartTotal() {
    let total = 0;
    this.allCarts.forEach((item: any) => {
      console.log(item);
      total += item.grandTotal;
      this.cartTotalPrice = total;
      this.offerTotalPrice = this.cartTotalPrice;
    });
  }

  incrementCartProduct(id: any) {
    this.api.incrementCartProduct(id).subscribe(
      (result: any) => {
        this.allCarts = result;
        this.getCartTotal();
      },
      (result: any) => {
        alert(result.error);
      }
    );
  }

  decrementCartProduct(id: any) {
    this.api.decrementCartProduct(id).subscribe(
      (result: any) => {
        console.log(result);
        this.allCarts = result;
        this.getCartTotal();
        this.api.cartCount();
      },
      (result: any) => {
        alert(result.error);
      }
    );
  }

  addressForm = this.fb.group({
    name: [''],
    houseNumber: [''],
    streetName: [''],
    state: [''],
    pincode: [''],
    mobileNumber: [''],
  });

  submitForm() {
    if (this.addressForm.valid) {
      this.name = this.addressForm.value.name || '';
      this.houseNumber = this.addressForm.value.houseNumber || '';
      this.streetName = this.addressForm.value.streetName || '';
      this.state = this.addressForm.value.state || '';
      this.pincode = this.addressForm.value.pincode || '';
      this.mobileNumber = this.addressForm.value.mobileNumber || '';
      this.proceedToPayment = true;
    } else {
      alert('Please enter correct Details');
    }
  }

  offerClick() {
    this.offerClicked = true;
  }

  discountClick(value: any) {
    this.discountStatus = true;
    this.offerTotalPrice = (this.offerTotalPrice * (100 - value)) / 100;
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: '9.99',
                breakdown: {
                  item_total: {
                    currency_code: 'EUR',
                    value: '9.99',
                  },
                },
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'EUR',
                    value: '9.99',
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  showPaypal() {
    this.showPaypalButton = true;
  }
}
