import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  constructor(private api: ApiService) {}
  allWishlists: any = [];
  product: any = {};

  ngOnInit(): void {
    this.api.viewWishlist().subscribe(
      (result: any) => {
        console.log(result);
        this.allWishlists = result;
      },
      (result: any) => {
        console.log(result.error);
      }
    );
    
  }

  addToCart(product: any) {
    const { id, title, price, image } = this.product;

    this.api.addToWishlist(id, title, price, image).subscribe(
      (result: any) => {
        alert(result);
      },
      (result: any) => {
        alert(result.error);
      }
    );
    Object.assign(product, { quantity: 1 });
    console.log(product);
    this.api.addToCart(product).subscribe(
      (result: any) => {
        alert(result);
        this.api.cartCount();
      },
      (result: any) => {
        alert(result.error);
      }
    );
  }

  deleteWishlistItem(id:any){
    this.api.deleteWishlistProduct(id).subscribe(
      (result: any) => {
        console.log(result);
        this.allWishlists = result;
        alert("Product has been removed")
      },
      (result: any) => {
        console.log(result.error);
      }
    );
  }
}
