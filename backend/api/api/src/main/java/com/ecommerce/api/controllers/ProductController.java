package com.ecommerce.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
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
    private String publishAProduct(@RequestBody ProductDTO productToPublish){
        return productService.publishProduct(productToPublish);
    }
}
