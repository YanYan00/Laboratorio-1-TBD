package com.ecommerce.api.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "auth_user")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class AuthUser {

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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user", unique = true, nullable = false)
    private Users user;
}
