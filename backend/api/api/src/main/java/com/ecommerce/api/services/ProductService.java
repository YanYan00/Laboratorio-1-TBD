package com.ecommerce.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.api.dto.ProductDTO;
import com.ecommerce.api.repositories.ProductRepository;

@Service

public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public ProductService(ProductRepository product){
        this.productRepository = product;
    }

    public String publishProduct(ProductDTO productToPublish){
        
        if(productToPublish.getProductPrice() <= 0){
            return "Error: El precio de publicacion debe ser mayor a 0";
        }

        int saved = productRepository.saveProduct(productToPublish);
        
        return saved > 0 ? "Producto publicado" : "Error al publicar";
    }

}
