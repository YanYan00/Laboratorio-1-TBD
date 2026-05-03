package com.ecommerce.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.api.dto.ProductDTO;
import com.ecommerce.api.services.ProductService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/products")

public class ProductController {

    @Autowired
    private ProductService productService;

    public ProductController(ProductService product){
        this.productService = product;
    }

    @PostMapping("/publish")
    public ResponseEntity<?> publishAProduct(@RequestBody ProductDTO productToPublish){
        
        String response = productService.publishProduct(productToPublish);
        
        if(response.contains("Error")){
            return ResponseEntity.badRequest().body(response); 
        }
        return ResponseEntity.ok(response);
    }
}
