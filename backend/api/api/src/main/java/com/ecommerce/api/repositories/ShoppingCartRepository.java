package com.ecommerce.api.repositories;

import com.ecommerce.api.models.ShoppingCart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.Optional;

@Repository
public class ShoppingCartRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // function for mapping columns
    private final RowMapper<ShoppingCart> shoppingCartRowMapper = (rs, rowNum) -> new ShoppingCart(
            rs.getLong("id_shopping_cart"),
            rs.getLong("id_user")
    );

    // create
    public int saveShoppingCart(ShoppingCart shoppingCart){
        String sql = """
                INSERT INTO shopping_cart (id_user)
                VALUES (?)
                """;
        return jdbcTemplate.update(sql,
                shoppingCart.getId_user());

    }

    // read
    public List<ShoppingCart> findAll(){
        String sql = "SELECT * FROM shopping_cart";
        return jdbcTemplate.query(sql, shoppingCartRowMapper);
    }

    // read
    public Optional<ShoppingCart> findById(Long id){
        String sql = "SELECT * FROM shopping_cart WHERE id_shopping_cart = ?";
        return jdbcTemplate.query(sql,shoppingCartRowMapper,id)
                .stream().findFirst();

    }

    // delete
    public int deleteById(Long id){
        String sql = "DELETE FROM shopping_cart WHERE id_shopping_cart = ?";
        return jdbcTemplate.update(sql, id);
    }


    //update

    public int update(Long id, ShoppingCart shoppingCart){
        String sql = """
                UPDATE shopping_cart SET
                 id_user = ?
                where id_shopping_cart = ?
                """;
        return jdbcTemplate.update(sql,
                shoppingCart.getId_user(),
                id);
    }

    public Optional<ShoppingCart> findByUserId(Long id_user){

        String sql = "SELECT * FROM shopping_cart WHERE id_user = ?";

        return jdbcTemplate.query(sql, shoppingCartRowMapper, id_user).stream().findFirst();
    }

    public Long createCartAndReturnId(Long id_user){
        
        String sql = "INSERT INTO shopping_cart (id_user) VALUES (?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {

            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id_shopping_cart"});
            ps.setLong(1, id_user);
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

}
