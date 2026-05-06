package com.ecommerce.api.repositories;

import com.ecommerce.api.dto.PaymentDTO;
import com.ecommerce.api.dto.PurchaseDetailDTO;
import com.ecommerce.api.dto.SalesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SalesRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public SalesRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<SalesDTO> salesDTORowMapper = (rs, rowNum) -> {
        SalesDTO dto = new SalesDTO();

        dto.setMonth(rs.getTimestamp("month").toLocalDateTime());
        dto.setCategoryName(rs.getString("category_name"));
        dto.setTotalProductsSold(rs.getDouble("total_products_sold"));
        dto.setTotalSalesAmount(rs.getDouble("total_sales_amount"));

        return dto;
    };

    public List<SalesDTO> findByUser(Long idUser) {
        String sql = """
            SELECT *
            FROM monthly_sales_by_product_category
            WHERE id_user = ?
        """;

        return jdbcTemplate.query(sql, salesDTORowMapper, idUser);
    }

    public void checkout(Integer idUser, String paymentMethod) {
        String sql = "CALL checkout_cart(?, ?)";
        jdbcTemplate.update(sql, idUser, paymentMethod);
    }

    public void approvePayment(Integer idPayment) {
        String sql = "UPDATE payments SET status = 'APPROVED' WHERE id_payment = ?";
        jdbcTemplate.update(sql, idPayment);
    }

    public void cancelPayment(Integer idPayment) {
        String sql = "UPDATE payments SET status = 'CANCELLED' WHERE id_payment = ?";
        jdbcTemplate.update(sql, idPayment);
    }
    public void restoreStock(Integer idPayment) {
        String sql = "CALL restore_stock_on_cancel(?)";
        jdbcTemplate.update(sql, idPayment);
    }
    public void updateStatus(Integer idPayment, String status) {
        String sql = "UPDATE payments SET status = ? WHERE id_payment = ?";
        jdbcTemplate.update(sql, status, idPayment);
    }

    public String getPaymentStatus(Integer idPayment) {
        String sql = "SELECT status FROM payments WHERE id_payment = ?";
        try {
            return jdbcTemplate.queryForObject(sql, String.class, idPayment);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Integer getPaymentOwner(Integer idPayment) {
        String sql = "SELECT id_user FROM payments WHERE id_payment = ?";
        try {
            return jdbcTemplate.queryForObject(sql, Integer.class, idPayment);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void discountStockFromPayment(Integer idPayment) {
        String sql = """
        UPDATE products p
        SET stock = stock - dp.quantity
        FROM detail_payment dp
        WHERE dp.id_product = p.id_product 
          AND dp.id_payment = ?
        """;
        jdbcTemplate.update(sql, idPayment);
    }

    public List<PaymentDTO> getPendingPayments() {
        String sql = "SELECT * FROM payments WHERE status = 'PENDING'";
        return jdbcTemplate.query(sql, paymentRowMapper());
    }

    public List<PaymentDTO> getPaymentsByUser(Integer idUser) {
        String sql = "SELECT * FROM payments WHERE id_user = ? ORDER BY payment_date DESC";
        return jdbcTemplate.query(sql, paymentRowMapper(), idUser);
    }

    private RowMapper<PaymentDTO> paymentRowMapper() {
        return (rs, rowNum) -> {
            PaymentDTO p = new PaymentDTO();
            p.setIdPayment(rs.getInt("id_payment"));
            p.setIdUser(rs.getInt("id_user"));
            p.setTotal(rs.getDouble("total"));
            p.setStatus(rs.getString("status"));
            p.setPaymentMethod(rs.getString("payment_method"));
            p.setPaymentDate(rs.getTimestamp("payment_date").toLocalDateTime());
            return p;
        };
    }

    public List<PurchaseDetailDTO> getInvoiceDetails(Integer idPayment) {
        String sql = """
            SELECT p.id_payment, p.payment_date, pr.product_name, dp.unit_price, dp.quantity, dp.subtotal 
            FROM payments p 
            JOIN detail_payment dp ON p.id_payment = dp.id_payment 
            JOIN products pr ON dp.id_product = pr.id_product 
            WHERE p.id_payment = ?
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            PurchaseDetailDTO dto = new PurchaseDetailDTO();
            dto.setId_payment(rs.getLong("id_payment"));
            dto.setPayment_date(rs.getTimestamp("payment_date").toLocalDateTime());
            dto.setProduct_name(rs.getString("product_name"));
            dto.setUnit_price(rs.getDouble("unit_price"));
            dto.setQuantity(rs.getDouble("quantity"));
            dto.setTotal_paid(rs.getDouble("subtotal"));
            return dto;
        }, idPayment);
    }

}
