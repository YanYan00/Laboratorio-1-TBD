package com.ecommerce.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
    private Integer idPayment;
    private Integer idUser;
    private Double total;
    private LocalDateTime paymentDate;
    private String status;
    private String paymentMethod;
}
