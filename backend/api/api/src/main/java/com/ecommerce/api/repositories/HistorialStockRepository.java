package com.ecommerce.api.repositories;

import com.ecommerce.api.models.HistorialStock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class HistorialStockRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // function for mapping columns
    private final RowMapper<HistorialStock> historialStockRowMapper = (rs, rowNum) -> new HistorialStock(
            rs.getLong("id_historial"),
            rs.getLong("id_user"),
            rs.getLong("id_product"),
            rs.getDouble("amount_modificated")
    );



    // create
    public int saveHistorialSock(HistorialStock historialStock){
        String sql = """
                INSERT INTO historial_stock(id_user, id_product, amount_modificated)
                VALUES (?, ?, ?)
                """;
        return  jdbcTemplate.update(sql,
                historialStock.getId_user(),
                historialStock.getId_product(),
                historialStock.getAmountModificated());

    }

    // read
    public List<HistorialStock> findAll(){
        String sql = "SELECT * FROM historial_stock";
        return  jdbcTemplate.query(sql,historialStockRowMapper);
    }

    // read
    public Optional<HistorialStock> findById(Long id) {
        String sql = "SELECT * FROM historial_stock WHERE id_historial = ?";
        return jdbcTemplate.query(sql, historialStockRowMapper, id)
                .stream()
                .findFirst();
    }

    // delete
    public int deleteById(Long id){
        String sql= "DELETE FROM historial_stock WHERE id_historial = ?";
        return jdbcTemplate.update(sql, id);
    }

    //update
    public int update(Long id, HistorialStock historialStock){
        String sql = """
                UPDATE historial_stock SET
                    id_user = ?,
                    id_product = ?,
                    amount_modificated = ?
                WHERE id_historial = ?
                """;
        return jdbcTemplate.update(sql,
                historialStock.getId_user(),
                historialStock.getId_product(),
                historialStock.getAmountModificated(),
                id);
    }

}
