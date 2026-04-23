package com.ecommerce.api.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true,nullable = false)
    private String id_user;
    @Column(nullable = false)
    private String name;
    @Column(unique = true, nullable = false, length = 25)
    private String rut;
    @Column(nullable = false)
    private String address;
    @Column(nullable = false)
    private String phone;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_role", nullable = false)
    private Role role;
}
