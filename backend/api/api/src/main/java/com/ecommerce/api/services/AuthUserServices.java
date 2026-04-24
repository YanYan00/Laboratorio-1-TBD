package com.ecommerce.api.services;

import com.ecommerce.api.dto.RegisterDTO;
import com.ecommerce.api.repositories.AuthUserRepository;
import com.ecommerce.api.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthUserServices {
    @Autowired
    private AuthUserRepository authUserRepository;

    public String createUser(RegisterDTO user){
        if (user.getPassword().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }
        if (!user.getEmail().contains("@") || !user.getEmail().contains(".")) {
            throw new IllegalArgumentException("El formato del correo no es válido");
        }
        if (!user.getPassword().equals(user.getConfirmPassword())) {
            throw new RuntimeException("Las contraseñas deben ser iguales");
        }
        if(authUserRepository.existsByEmail(user.getEmail())){
            throw new RuntimeException("Este email ya esta registrado");
        }
        if(authUserRepository.existsByUsername(user.getUsername())){
            throw new RuntimeException("Este username ya esta registrado");
        }

        Long newUserId= authUserRepository.saveUserAuth(user);
        authUserRepository.saveUserInfo(user,newUserId);

        return "Usuario registrado con exito";
    }
}
