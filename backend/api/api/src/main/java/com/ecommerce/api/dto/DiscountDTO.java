package com.ecommerce.api.dto;

import lombok.Data;

@Data
public class DiscountDTO {
    private Long idCategory; // o id_category
    private double percent;   // o percentage
}