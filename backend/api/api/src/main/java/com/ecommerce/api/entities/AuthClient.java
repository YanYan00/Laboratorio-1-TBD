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
@Table(name = "authClients")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class AuthClient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id_auth;

    @Column(unique = true, nullable = false, length = 30)
    private String username;

    @Column(nullable = false, length = 10)
    private String password;

    @Column(unique = true, nullable = false, length = 50)
    private String email;
}
