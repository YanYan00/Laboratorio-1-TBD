package com.ecommerce.api.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce.api.dto.ProductDTO;

@Repository

public class ProductRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public ProductRepository (JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public int saveProduct(ProductDTO product){

        String sql = "INSERT INTO products (product_name, product_description, product_price, stock) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(
            sql,
            product.getProductName(),
            product.getProductDescription(),
            product.getProductPrice(),
            product.getStock()
        );
    }
}
