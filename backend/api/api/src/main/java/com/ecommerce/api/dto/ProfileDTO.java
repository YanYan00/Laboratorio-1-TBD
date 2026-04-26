package com.ecommerce.api.dto;

import lombok.Data;

@Data
public class ProfileDTO {
    private Long idUser;
    private String name;
    private String email;
    private String roleName;
}
