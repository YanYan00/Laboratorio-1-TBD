package com.ecommerce.api.controllers;

import com.ecommerce.api.models.ShoppingCart;
import com.ecommerce.api.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.api.dto.CartPurchaseDTO;
import com.ecommerce.api.services.ShoppingCartServices;

import java.util.Optional;


@RestController
@RequestMapping("/api/cart")

public class ShoppingCartController {

    @Autowired
    private ShoppingCartServices shoppingCartServices;
    @Autowired
    private UsersRepository usersRepository;

    @PostMapping("/add") //
    public ResponseEntity<?> addToCart(
            @RequestBody CartPurchaseDTO purchase,
            Authentication authentication
    ) {
        String username = authentication.getName();

        Long userId = usersRepository.findIdByUsername(username);

        purchase.setId_user(userId);

        String response = shoppingCartServices.addProductToCart(purchase);

        if(response.contains("Error")){
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-cart")
    public ResponseEntity<?> getMyCart(Authentication authentication) {
        String username = authentication.getName();
        Long userId = usersRepository.findIdByUsername(username);
        Optional<ShoppingCart> cart = shoppingCartServices.getCartByUserId(userId);

        if (cart.isEmpty()) {
            return ResponseEntity.ok("El carrito está vacío");
        }

        return ResponseEntity.ok(cart.get());
    }
}
