package com.ecommerce.api.repositories;

import com.ecommerce.api.models.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CategoryRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public CategoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    private final RowMapper<Category> categoryRowMapper = (rs, rowNum) -> new Category(
            rs.getLong("id_category"),
            rs.getString("category_name"),
            rs.getString("category_description")
    );

    // create
    // no set PK SERIAL because DB make it
    public int saveCategory(Category category) {
        String sql = """
                            INSERT INTO categories(category_name, category_description)
                            VALUES(?, ?)
                """;
        return jdbcTemplate.update(sql,
                category.getCategory_name(),
                category.getCategory_description());
    }

    // read
    public List<Category> findAll(){
        String sql = "SELECT * FROM categories";
        return jdbcTemplate.query(sql, categoryRowMapper);
    }
    // read
    public Optional<Category> findById(Long id){
        String sql= "SELECT * FROM categories WHERE id_category = ?";
        return jdbcTemplate.query(sql,categoryRowMapper,id)
                .stream()
                .findFirst();
    }

    // delete
    public int deleteById(Long id){
        String sql = "DELETE FROM categories WHERE id_category = ?";
        return  jdbcTemplate.update(sql,id);
    }

    // update

    public int update(Long id, Category category){
        String sql = """
                UPDATE categories SET
                    category_name = ?,
                    category_description = ?
                WHERE id_category = ?
                
                """;
        return  jdbcTemplate.update(sql,
                category.getCategory_name(),
                category.getCategory_description(),
                id);
    }








}








