package com.ecommerce.api.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class HistorialStock {

    private Long id_historial;

    private double amountModificated;
}
