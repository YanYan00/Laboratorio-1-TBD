package com.ecommerce.api.dto;

import lombok.Data;

@Data

public class ProductDTO {

    private String productName;

    private String productDescription;

    private double productPrice;


    private double stock;

    private Long id_category;

    private Long skuProduct;
}
