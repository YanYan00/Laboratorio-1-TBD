package com.ecommerce.api.dto;

import lombok.Data;

@Data
public class DiscountDTO {
    private Long idCategory;
    private double percent;
}