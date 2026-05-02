package com.ecommerce.api.repositories;

import com.ecommerce.api.dto.SalesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SalesRepository {



    private final JdbcTemplate jdbcTemplate;

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
            FROM onthly_sales_by_product_category
            WHERE id_user = ?
        """;

        return jdbcTemplate.query(sql, salesDTORowMapper, idUser);
    }



}
