package com.ecommerce.api.repositories;

import com.ecommerce.api.models.Users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UsersRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // function for mapping
    private final RowMapper<Users> usersRowMapper = (rs, rowNum) -> new Users(
            rs.getLong("id_user"),
            rs.getString("name_user"),
            rs.getString("rut"),
            rs.getString("address"),
            rs.getString("phone"),
            rs.getLong("id_role"),
            rs.getLong("id_auth")
    );

    // CREATE
    public int save(Users user) {
        String sql = """
            INSERT INTO users (name_user, rut, address, phone, id_role, id_auth)
            VALUES (?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                user.getName(),
                user.getRut(),
                user.getAddress(),
                user.getPhone(),
                user.getId_role(),
                user.getId_auth()
        );
    }

    // READ
    public List<Users> findAll() {
        String sql = "SELECT * FROM users";
        return jdbcTemplate.query(sql, usersRowMapper);
    }

    // READ BY ID
    public Optional<Users> findById(Long id) {
        String sql = "SELECT * FROM users WHERE id_user = ?";
        return jdbcTemplate.query(sql, usersRowMapper, id)
                .stream()
                .findFirst();
    }


    // DELETE
    public int deleteById(Long id) {
        String sql = "DELETE FROM users WHERE id_user = ?";
        return jdbcTemplate.update(sql, id);
    }



    // UPDATE
    public int update(Long id, Users user) {
        String sql = """
            UPDATE users SET
                name_user = ?,
                rut       = ?,
                address   = ?,
                phone     = ?,
                id_role   = ?,
                id_auth   = ?
            WHERE id_user = ?
            """;
        return jdbcTemplate.update(sql,
                user.getName(),
                user.getRut(),
                user.getAddress(),
                user.getPhone(),
                user.getId_role(),
                user.getId_auth(),
                id
        );
    }



}
