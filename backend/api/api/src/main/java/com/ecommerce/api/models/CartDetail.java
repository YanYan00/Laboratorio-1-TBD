package com.ecommerce.api.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class CartDetail{

    private Long id_detail;

    private Long id_shopping_cart;

    private Long id_product;

    private double quantity;
    // type date will be automatically insert  by the database and cannot be modified
    private Date purchase_date;


}

