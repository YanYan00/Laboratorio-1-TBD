package com.ecommerce.api.repositories;

import com.ecommerce.api.models.CartDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CartDetailRepository {

    private JdbcTemplate jdbcTemplate;


    public CartDetailRepository (JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }
    // function for mapping columns

    private final RowMapper<CartDetail> cartDetailRowMapper = (rs, rowNum) -> new CartDetail(
            rs.getLong("id_detail"),
            rs.getLong("id_shopping_cart"),
            rs.getLong("id_product"),
            rs.getDouble("quantity")
    );

    // crate
    public  int saveCartDetail(CartDetail cartDetail){
        String sql= """
                INSERT INTO cart_detail (id_shopping_cart, id_product, quantity)
                VALUES(?,?,?)
                """;
        return jdbcTemplate.update(sql,
                cartDetail.getId_shopping_cart(),
                cartDetail.getId_product(),
                cartDetail.getQuantity());
    }

    // read
    public List<CartDetail> findAll(){
        String sql= "SELECT * FROM cart_detail";
        return jdbcTemplate.query(sql,cartDetailRowMapper);
    }

    // Read
    public Optional<CartDetail> findById(Long id){
        String sql= "SELECT * FROM cart_detail WHERE id_detail = ?";
        return jdbcTemplate.query(sql,cartDetailRowMapper,id)
                .stream().findFirst();
    }

    // Delete
    public int deleteById(Long id){
        String sql = "DELETE FROM cart_detail WHERE id_detail = ?";
        return jdbcTemplate.update(sql,id);
    }

    public int update(Long id, CartDetail cartDetail){
        String sql = """
                UPDATE cart_detail SET
                    id_shopping_cart = ?,
                    id_product = ?,
                    quantity = ?
                
                WHERE id_detail = ?
                
                """;

        return jdbcTemplate.update(sql,
                cartDetail.getId_shopping_cart(),
                cartDetail.getId_product(),
                cartDetail.getQuantity(),
                id);
    }






}
