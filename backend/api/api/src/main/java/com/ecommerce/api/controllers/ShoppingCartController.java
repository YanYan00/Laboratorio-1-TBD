package com.ecommerce.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.api.dto.CartPurchaseDTO;
import com.ecommerce.api.services.ShoppingCartServices;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/cart")

public class ShoppingCartController {

    @Autowired
    private ShoppingCartServices shoppingCartServices;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartPurchaseDTO purchase){

        String response = shoppingCartServices.addProductToCart(purchase);

        if(response.contains("Error")){
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }
}
