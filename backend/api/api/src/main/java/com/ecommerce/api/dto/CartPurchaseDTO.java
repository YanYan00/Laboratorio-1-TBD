package com.ecommerce.api.dto;

import lombok.Data;

@Data

public class CartPurchaseDTO {

    private Long id_user;

    private Long id_product;

    private double quantity;
}
