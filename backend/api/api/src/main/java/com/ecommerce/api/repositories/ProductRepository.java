package com.ecommerce.api.repositories;

import com.ecommerce.api.models.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.ecommerce.api.dto.ProductDTO;

import java.util.List;
import java.util.Optional;

@Repository

public class ProductRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public ProductRepository (JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }
    // function for mapping columns
    private final RowMapper<Product> productRowMapper = (rs, rowNum) -> new Product(
            rs.getLong("id_product"),
            rs.getString("product_name"),
            rs.getString("product_description"),
            rs.getDouble("product_price"),
            rs.getLong("SKU_product"),
            rs.getDouble("stock"),
            rs.getLong("id_category")
    );
    // create
    public int saveProduct(ProductDTO product) {
        String sql = """
        INSERT INTO products (id_category, SKU_product, product_name, product_description, product_price, stock)
        VALUES (?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                product.getId_category(),
                product.getSkuProduct(),
                product.getProductName(),
                product.getProductDescription(),
                product.getProductPrice(),
                product.getStock()
        );
    }
    //read
    public List<Product> findAll() {
        String sql = "SELECT * FROM products";
        return jdbcTemplate.query(sql, productRowMapper);
    }
    //read
    public Optional<Product> findById(Long id) {
        String sql = "SELECT * FROM product WHERE id_products = ?";
        return jdbcTemplate.query(sql, productRowMapper, id)
                .stream()
                .findFirst();
    }
    // delete
    public int deleteById(Long id) {
        String sql = "DELETE FROM product WHERE id_products = ?";
        return jdbcTemplate.update(sql, id);

    }

    // update
    public int update(Long id, Product product) {
        String sql = """
        UPDATE products SET
          product_name = ?,
          product_description = ?,
          product_price = ?,
          stock= ?
        WHERE id_product = ?
        """;
        return jdbcTemplate.update(sql,
                product.getProductName(),
                product.getProductDescription(),
                product.getProductPrice(),
                product.getStock(),
                id);
    }
}










