package com.ecommerce.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalesDTO {
    private LocalDateTime month;
    private String categoryName;
    private Double totalProductsSold;
    private Double totalSalesAmount;




}
