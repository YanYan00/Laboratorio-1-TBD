package com.ecommerce.api.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class AuthUser {

    private Long id_auth;

    private String username;

    private String password;

    private String email;

    private Long id_user;
}
