package com.ecommerce.api.dto;

import lombok.Data;

@Data
public class LoginDTO {
    private String identifier;
    private String password;
}
