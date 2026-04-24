package com.ecommerce.api.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Product {

    private Long id_product;

    private String productName;

    private String productDescription;

    private double productPrice;

    private double stock;

    private Long id_category;
}
