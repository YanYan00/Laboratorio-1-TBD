package com.ecommerce.api.entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor

public class ShoppingCart {

    private Long id_shoppingCart;

    private Long id_user;

}
