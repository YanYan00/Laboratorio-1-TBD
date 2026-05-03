package com.ecommerce.api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.api.dto.ProductDTO;
import com.ecommerce.api.models.Product;
import com.ecommerce.api.repositories.ProductRepository;
import com.ecommerce.api.services.ProductService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/products")

public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

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

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword){

        List<Product> keywordProducts = productRepository.searchByKeyword(keyword);
        return ResponseEntity.ok(keywordProducts);
    }
    
}
