package com.ecommerce.api.repositories;

import com.ecommerce.api.dto.RegisterDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;

@Repository
public class AuthUserRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public AuthUserRepository (JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }
    public boolean existsByUsername(String username){
        String sql = "SELECT COUNT(*) FROM auth_user WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count != null && count > 0;
    }
    public boolean existsByEmail(String email){
        String sql = "SELECT COUNT(*) FROM auth_user WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }
    public Long saveUserAuth(RegisterDTO register) {
        String sql = "INSERT INTO auth_user (username, password, email) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id_auth"});
            ps.setString(1, register.getUsername());
            ps.setString(2, register.getPassword());
            ps.setString(3, register.getEmail());
            return ps;
        }, keyHolder);
        return keyHolder.getKey().longValue();
    }
    public int saveUserInfo(RegisterDTO register, Long id_auth) {
        int role = 2;
        String sql = "INSERT INTO users (name_user, rut, address, phone, id_role, id_auth) VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(
                sql,
                register.getName_user(),
                register.getRut(),
                register.getAddress(),
                register.getPhone(),
                role,
                id_auth
        );
    }
}
