package com.ecommerce.api.services;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.api.dto.CartPurchaseDTO;
import com.ecommerce.api.models.CartDetail;
import com.ecommerce.api.models.Product;
import com.ecommerce.api.models.ShoppingCart;
import com.ecommerce.api.repositories.CartDetailRepository;
import com.ecommerce.api.repositories.ProductRepository;
import com.ecommerce.api.repositories.ShoppingCartRepository;

@Service

public class ShoppingCartServices {

    @Autowired
    ShoppingCartRepository shoppingCartRepository;

    @Autowired
    CartDetailRepository cartDetailRepository;

    @Autowired
    ProductRepository productRepository;

    public String addProductToCart(CartPurchaseDTO purchase){

        Optional<Product> product = productRepository.findById(purchase.getId_product());

        if(product.isEmpty()){
            return "Error: Producto no encontrado";
        }

        Product RealProduct = product.get();

        if(RealProduct.getStock() < purchase.getQuantity()){
            return "Error: no hay stock suficiente";
        }

        Optional<ShoppingCart> cart = shoppingCartRepository.findByUserId(purchase.getId_user());

        Long id_cart;

        if(cart.isPresent()){
            id_cart = cart.get().getId_shoppingCart();
        }else{
            id_cart = shoppingCartRepository.createCartAndReturnId(purchase.getId_user());
        }

        CartDetail cartDetail = new CartDetail(
            null,
            id_cart,
            purchase.getId_product(),
            purchase.getQuantity(),
            null
        );

        int saved = cartDetailRepository.saveCartDetail(cartDetail);

        return saved > 0 ? "Producto agregado al carrito con exito" : "Error al guardar el carrito";
    }
}
