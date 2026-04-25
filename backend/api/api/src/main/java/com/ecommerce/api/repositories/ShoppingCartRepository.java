package com.ecommerce.api.repositories;

import com.ecommerce.api.models.ShoppingCart;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ShoppingCartRepository {
    private JdbcTemplate jdbcTemplate;

    public ShoppingCartRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }
    // function for mapping columns
    private final RowMapper<ShoppingCart> shoppingCartRowMapper = (rs, rowNum) -> new ShoppingCart(
            rs.getLong("id_shopping_cart"),
            rs.getLong("id_user")
    );

    // create
    public int saveShoppingCart(ShoppingCart shoppingCart){
        String sql = """
                INSERT INTO shooping_cart (id_user)
                VALUES (?)
                """;
        return jdbcTemplate.update(sql,
                shoppingCart.getId_user());

    }

    // read
    public List<ShoppingCart> findAll(){
        String sql = "SELECT * FROM shooping_cart";
        return jdbcTemplate.query(sql, shoppingCartRowMapper);
    }

    // read
    public Optional<ShoppingCart> findById(Long id){
        String sql = "SELECT * FROM shooping_cart WHERE id_shopping_cart = ?";
        return jdbcTemplate.query(sql,shoppingCartRowMapper,id)
                .stream().findFirst();

    }

    // delete
    public int deleteById(Long id){
        String sql = "DELETE FROM shooping_cart WHERE id_shopping_cart = ?";
        return jdbcTemplate.update(sql, id);
    }


    //update

    public int update(Long id, ShoppingCart shoppingCart){
        String sql = """
                UPDATE shooping_cart SET
                 id_user = ?
                where id_shopping_cart = ?
                """;
        return jdbcTemplate.update(sql,
                shoppingCart.getId_user(),
                id);
    }

}
