package com.ecommerce.api.controllers;

import com.ecommerce.api.dto.SalesDTO;

import com.ecommerce.api.services.SalesService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SalesController {



    private final SalesService salesService;


    public SalesController(SalesService salesService) {
        this.salesService = salesService;
    }

    @GetMapping("/my-sales")
    @PreAuthorize("hasRole('USER')")
    public List<SalesDTO> mySales(){
        return salesService.getMySales();
    }


}
