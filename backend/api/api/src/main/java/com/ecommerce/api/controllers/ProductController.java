package com.ecommerce.api.controllers;

import java.util.List;

import com.ecommerce.api.dto.DiscountDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.api.dto.ProductDTO;
import com.ecommerce.api.models.Product;
import com.ecommerce.api.repositories.ProductRepository;
import com.ecommerce.api.services.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    public ProductController(ProductService product) {
        this.productService = product;
    }

    @PostMapping("/publish")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<?> publishAProduct(@RequestBody ProductDTO productToPublish) {
        String response = productService.publishProduct(productToPublish);
        if (response.contains("Error")) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> keywordProducts = productRepository.searchByKeyword(keyword);
        return ResponseEntity.ok(keywordProducts);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) Long id_category) {

        List<Product> products = (id_category != null)
                ? productRepository.findByCategory(id_category)
                : productRepository.findAll();

        return ResponseEntity.ok(products);
    }

    @PostMapping("/apply-discount") //
    public ResponseEntity<?> applyMassiveDiscount(@RequestBody DiscountDTO discountDTO) {
        try {
            productService.applyCategoryDiscount(discountDTO.getIdCategory(), (int) discountDTO.getPercent());
            return ResponseEntity.ok("Descuento aplicado con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al procesar el descuento: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Producto eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al eliminar: " + e.getMessage());
        }
    }
}