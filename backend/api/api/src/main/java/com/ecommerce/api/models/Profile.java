package com.ecommerce.api.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    private String username;
    private String email;
    private String name;
    private String rut;
    private String address;
    private String phone;

}
