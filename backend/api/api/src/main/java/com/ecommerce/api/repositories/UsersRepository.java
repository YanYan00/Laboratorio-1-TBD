package com.ecommerce.api.repositories;

import com.ecommerce.api.dto.ProfileDTO;
import com.ecommerce.api.models.Profile;
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

    public UsersRepository (JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    // function for mapping
    private final RowMapper<Users> usersRowMapper = (rs, rowNum) -> new Users(
            rs.getLong("id_user"),
            rs.getString("name_user"),
            rs.getString("rut"),
            rs.getString("address"),
            rs.getString("phone"),
            rs.getLong("id_auth")
    );

    // CREATE
    public int save(Users user) {
        String sql = """
            INSERT INTO users (name_user, rut, address, phone, id_auth)
            VALUES (?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                user.getName(),
                user.getRut(),
                user.getAddress(),
                user.getPhone(),
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
                id_auth   = ?
            WHERE id_user = ?
            """;
        return jdbcTemplate.update(sql,
                user.getName(),
                user.getRut(),
                user.getAddress(),
                user.getPhone(),
                user.getId_auth(),
                id
        );
    }

    // Profile



    //All profiles
    public List<ProfileDTO> findAllProfiles() {
        String sql = "SELECT u.id_user, u.name_user,a.email , r.name_role FROM users u  INNER JOIN auth_user a ON u.id_auth = a.id_auth INNER JOIN roles r ON a.id_role = r.id_role";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ProfileDTO profileDTO = new ProfileDTO();
            profileDTO.setIdUser(rs.getLong("id_user"));
            profileDTO.setName(rs.getString("name_user"));
            profileDTO.setEmail(rs.getString("email"));
            profileDTO.setRoleName(rs.getString("name_role"));
            return profileDTO;
        });
    }

    //My profile
    public Profile findProfileByUsername(String username) {
        String sql = "SELECT u.name_user,u.rut,u.address,u.phone, a.username, a.email FROM users u INNER JOIN auth_user a ON u.id_auth = a.id_auth WHERE a.username = ?";
        return jdbcTemplate.query(sql, rs->{
            if(rs.next()){
                Profile profile = new Profile();
                profile.setUsername(rs.getString("username"));
                profile.setEmail(rs.getString("email"));
                profile.setName(rs.getString("name_user"));
                profile.setRut(rs.getString("rut"));
                profile.setAddress(rs.getString("address"));
                profile.setPhone(rs.getString("phone"));
                return profile;
            }
            return null;
        }, username);
    }

}
