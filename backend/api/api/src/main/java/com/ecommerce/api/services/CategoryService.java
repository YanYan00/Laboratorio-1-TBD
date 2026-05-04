package com.ecommerce.api.services;

import com.ecommerce.api.models.Category;
import com.ecommerce.api.repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));
    }

    public String createCategory(Category category) {
        if (category.getCategory_name() == null || category.getCategory_name().isBlank()) {
            throw new RuntimeException("El nombre de la categoría es obligatorio");
        }
        categoryRepository.saveCategory(category);
        return "Categoría creada exitosamente";
    }

    public String updateCategory(Long id, Category category) {
        categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));
        if (category.getCategory_name() == null || category.getCategory_name().isBlank()) {
            throw new RuntimeException("El nombre de la categoría es obligatorio");
        }
        categoryRepository.update(id, category);
        return "Categoría actualizada exitosamente";
    }

    public String deleteCategory(Long id) {
        categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));
        categoryRepository.deleteById(id);
        return "Categoría eliminada exitosamente";
    }
}
