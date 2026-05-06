package com.ecommerce.api.services;

import com.ecommerce.api.dto.CartPurchaseDTO;
import com.ecommerce.api.dto.PaymentDTO;
import com.ecommerce.api.dto.SalesDTO;
import com.ecommerce.api.repositories.SalesRepository;
import com.ecommerce.api.repositories.UsersRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public String checkout(Integer idUser, String paymentMethod, List<CartPurchaseDTO> cartItems) {
        List<String> validMethods = List.of("CARD", "TRANSFER", "Efectivo");
        if (!validMethods.contains(paymentMethod)) {
            throw new RuntimeException("Método de pago inválido: " + paymentMethod);
        }

        salesRepository.checkout(idUser, paymentMethod);

        if ("TRANSFER".equals(paymentMethod)) {
            return "Orden registrada. Pendiente de validación de transferencia.";
        }

        return "Orden procesada exitosamente. Stock actualizado.";
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
            throw new RuntimeException("Orden #" + idPayment + " no encontrada en el sistema");
        }

        if ("CANCELLED".equalsIgnoreCase(status)) {
            throw new RuntimeException("La orden ya se encuentra cancelada");
        }

        if (!isAdmin) {
            Integer owner = salesRepository.getPaymentOwner(idPayment);

            if (owner == null || !owner.equals(idUser)) {
                throw new RuntimeException("No tienes permisos: Esta orden pertenece a otro usuario");
            }
        }

        if ("APPROVED".equalsIgnoreCase(status)) {
            salesRepository.restoreStock(idPayment);
        }

        salesRepository.updateStatus(idPayment, "CANCELLED");

        return "Orden #" + idPayment + " cancelada exitosamente";
    }

    public List<PaymentDTO> getPendingPayments() {
        return salesRepository.getPendingPayments();
    }

    public List<PaymentDTO> getMyPayments(Integer idUser) {
        return salesRepository.getPaymentsByUser(idUser);
    }
}
