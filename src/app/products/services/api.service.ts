import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  searchTerm = new BehaviorSubject('');

  cartItemCount = new BehaviorSubject(0);

  constructor(private http: HttpClient) {
    this.cartCount();
  }

  BASE_URL = 'https://ecart-3pcz.onrender.com';

  // api function
  getAllProducts() {
    return this.http.get(`${this.BASE_URL}/products/all-products`);
  }

  viewProduct(id: any) {
    return this.http.get(`${this.BASE_URL}/products/view-product/${id}`);
  }

  addToWishlist(id: any, title: any, price: any, image: any) {
    const body = { id, title, price, image };
    return this.http.post(`${this.BASE_URL}/wishlists/add-to-wishlist`, body);
  }

  viewWishlist() {
    return this.http.get(`${this.BASE_URL}/wishlists/view-all-wishlist`);
  }

  deleteWishlistProduct(id: any) {
    return this.http.delete(
      `${this.BASE_URL}/wishlists/delete-wishlist-product/${id}`
    );
  }

  addToCart(product: any) {
    const body = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: product.quantity,
    };
    return this.http.post(`${this.BASE_URL}/carts/add-to-cart`, body);
  }

  viewCart() {
    return this.http.get(`${this.BASE_URL}/carts/view-all-cart`);
  }

  cartCount() {
    this.viewCart().subscribe((result: any) => {
      this.cartItemCount.next(result.length);
    });
  }

  deleteCartProduct(id: any) {
    return this.http.delete(
      `${this.BASE_URL}/carts/delete-cart-product/${id}`
    );
  }

  incrementCartProduct(id:any){
    return this.http.get(
      `${this.BASE_URL}/carts/increment-cart-product/${id}`
    );
  }
  decrementCartProduct(id:any){
    return this.http.get(
      `${this.BASE_URL}/carts/decrement-cart-product/${id}`
    );
  }
}
