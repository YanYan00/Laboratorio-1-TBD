package com.ecommerce.api.controllers;

import com.ecommerce.api.dto.LoginDTO;
import com.ecommerce.api.dto.RegisterDTO;
import com.ecommerce.api.services.AuthUserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthUserController {
    @Autowired
    private AuthUserServices authUserServices;
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO user) {
        try {
            String response = authUserServices.createUser(user);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO login){
        try {
            String response = authUserServices.loginUser(login);
            return ResponseEntity.ok(response);
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
