package com.ecommerce.api.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class HistorialStock {

    private Long id_historial;

    private Long id_user;

    private  Long id_product;

    private double amountModificated;






}
