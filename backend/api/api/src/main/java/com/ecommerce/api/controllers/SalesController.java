package com.ecommerce.api.controllers;

import com.ecommerce.api.config.JwtUtils;
import com.ecommerce.api.dto.CartPurchaseDTO;
import com.ecommerce.api.dto.PurchaseDetailDTO;
import com.ecommerce.api.dto.SalesDTO;
import com.ecommerce.api.repositories.SalesRepository;
import com.ecommerce.api.services.SalesService;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SalesController {

    @Autowired
    private SalesService salesService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private SalesRepository salesRepository;

    public SalesController(SalesService salesService) {
        this.salesService = salesService;
    }

    @GetMapping("/my-sales")
    @PreAuthorize("hasAuthority('USER')")
    public List<SalesDTO> mySales(){
        return salesService.getMySales();
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> checkout(
            @RequestParam String paymentMethod,
            @RequestBody List<CartPurchaseDTO> cartItems,
            HttpServletRequest httpRequest) {

        Integer idUser = jwtUtils.extractIdUser(httpRequest);

        return ResponseEntity.ok(salesService.checkout(idUser, paymentMethod, cartItems));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> approvePayment(@PathVariable Integer id) {
        return ResponseEntity.ok(salesService.approvePayment(id));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<?> cancelPayment(@PathVariable Integer id, HttpServletRequest httpRequest) {
        Integer idUser  = jwtUtils.extractIdUser(httpRequest);
        boolean isAdmin = jwtUtils.hasRole(httpRequest, "ADMIN");
        return ResponseEntity.ok(salesService.cancelPayment(id, idUser, isAdmin));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getPendingPayments() {
        return ResponseEntity.ok(salesService.getPendingPayments());
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> getMyOrders(HttpServletRequest httpRequest) {
        Integer idUser = jwtUtils.extractIdUser(httpRequest);
        return ResponseEntity.ok(salesService.getMyPayments(idUser));
    }

    @GetMapping("/{id_payment}/purchase")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> getPurchaseHistory(@PathVariable Integer id_payment) {

        List<PurchaseDetailDTO> invoiceDetails = salesRepository.getInvoiceDetails(id_payment);

        if(invoiceDetails.isEmpty()) {
            return ResponseEntity.badRequest().body("Factura no encontrada o sin detalles");
        }

        return ResponseEntity.ok(invoiceDetails);
    }
}
