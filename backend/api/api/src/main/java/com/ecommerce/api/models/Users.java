package com.ecommerce.api.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users{
   
    private Long id_user;
  
    private String name;
  
    private String rut;
   
    private String address;
    
    private String phone;
  
    private Long id_role;

    private Long id_auth;
}
