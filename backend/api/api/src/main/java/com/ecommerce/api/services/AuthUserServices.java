package com.ecommerce.api.services;

import com.ecommerce.api.config.JwtUtils;
import com.ecommerce.api.dto.LoginDTO;
import com.ecommerce.api.dto.RegisterDTO;
import com.ecommerce.api.models.AuthUser;
import com.ecommerce.api.repositories.AuthUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthUserServices {
    @Autowired
    private AuthUserRepository authUserRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtils jwtUtils;

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
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        Long newUserId= authUserRepository.saveUserAuth(user);
        authUserRepository.saveUserInfo(user,newUserId);

        return "Usuario registrado con exito";
    }

    public String loginUser(LoginDTO login){
        AuthUser user = authUserRepository.findByIdentifier(login.getIdentifier());
        if (user == null){
            throw new RuntimeException("Credenciales invalidas");
        }
        if(passwordEncoder.matches(login.getPassword(),user.getPassword())){
            return jwtUtils.generateToken(user);
        }
        else {
            throw new RuntimeException("Contrasena incorrecta");
        }
    }
}
