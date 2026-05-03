package com.ecommerce.api.services;

import com.ecommerce.api.dto.PaymentDTO;
import com.ecommerce.api.dto.SalesDTO;
import com.ecommerce.api.repositories.SalesRepository;
import com.ecommerce.api.repositories.UsersRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class SalesService {


    private final UsersRepository usersRepository;
    private final SalesRepository salesRepository;

    public SalesService(UsersRepository usersRepository,
                        SalesRepository salesRepository) {
        this.usersRepository = usersRepository;
        this.salesRepository = salesRepository;
    }


    public List<SalesDTO> getMySales() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        Long idUser = usersRepository.findIdByUsername(username);

        return salesRepository.findByUser(idUser);
    }

    public String checkout(Integer idUser, String paymentMethod) {
        List<String> validMethods = List.of("CARD", "TRANSFER");
        if (!validMethods.contains(paymentMethod)) {
            throw new RuntimeException("Método de pago inválido: " + paymentMethod);
        }
        salesRepository.checkout(idUser, paymentMethod);
        return "Orden creada exitosamente";
    }

    public String approvePayment(Integer idPayment) {
        String status = salesRepository.getPaymentStatus(idPayment);
        if (!status.equals("PENDING")) {
            throw new RuntimeException("Solo se pueden aprobar órdenes en estado PENDING");
        }
        salesRepository.approvePayment(idPayment);
        salesRepository.discountStockFromPayment(idPayment);
        return "Orden aprobada exitosamente";
    }

    public String cancelPayment(Integer idPayment, Integer idUser, boolean isAdmin) {
        String status = salesRepository.getPaymentStatus(idPayment);

        if (status == null) {
            throw new RuntimeException("Orden no encontrada");
        }
        if (status.equals("CANCELLED")) {
            throw new RuntimeException("La orden ya está cancelada");
        }
        if (!isAdmin) {
            Integer owner = salesRepository.getPaymentOwner(idPayment);
            if (!owner.equals(idUser)) {
                throw new RuntimeException("No tienes permiso para cancelar esta orden");
            }
        }
        if (status.equals("APPROVED")) {
            salesRepository.restoreStock(idPayment);
        }

        salesRepository.cancelPayment(idPayment);
        return "Orden cancelada exitosamente";
    }

    public List<PaymentDTO> getPendingPayments() {
        return salesRepository.getPendingPayments();
    }

    public List<PaymentDTO> getMyPayments(Integer idUser) {
        return salesRepository.getPaymentsByUser(idUser);
    }
}
