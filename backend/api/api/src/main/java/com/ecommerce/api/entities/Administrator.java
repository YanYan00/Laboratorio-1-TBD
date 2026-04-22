package com.ecommerce.api.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "administrator")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Administrator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id_administrator;

    @Column(unique = true, nullable = false, length = 25)
    private String rutAdmin;

    @Column(nullable = false, length = 25)
    private String adminName;

    @Column(nullable = false, length = 25)
    private String adminLastName;
}
