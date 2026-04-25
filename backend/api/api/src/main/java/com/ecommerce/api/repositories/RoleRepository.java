package com.ecommerce.api.repositories;

import com.ecommerce.api.models.Role;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RoleRepository {
    private JdbcTemplate jdbcTemplate;

    public RoleRepository (JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    //function for mapping columns

    private final RowMapper<Role> roleRowMapper = (rs, rowNum) -> new Role(
            rs.getLong("id_role"),
            rs.getString("name_role")
    );

    //create
    public  int saveRole(Role role){
        String sql = """
                INSERT INTO roles (id_role, name_role)
                VALUES (?, ?)
                """;
        return jdbcTemplate.update(sql,
                role.getId_role(),
                role.getName());
    }

    //read
    public List<Role> findAll(){
        String sql = "SELECT * FROM roles";
        return jdbcTemplate.query(sql, roleRowMapper);


    }
    // read
    public Optional<Role> findById(Long id){
        String sql = "SELECT * FROM roles WHERE id_role = ?";
        return jdbcTemplate.query(sql, roleRowMapper, id)
                .stream().findFirst();
    }


    // delete
    public int deleteById(Long id){
        String sql = "DELETE FROM roles WHERE id_role = ?";
        return jdbcTemplate.update(sql,id);
    }

    //update
    // it's not necessary


}
