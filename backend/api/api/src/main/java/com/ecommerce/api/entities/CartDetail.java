package com.ecommerce.api.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class CartDetail{

    private Long id_detail;

    private double amountOfProduct;

    private Long id_shopping_cart;

    private Long id_product;



}

