package com.ecommerce.api.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PurchaseDetailDTO {

    private Long id_payment;
    private LocalDateTime payment_date;
    private String product_name;
    private double unit_price;
    private double quantity;
    private double total_paid;
}
