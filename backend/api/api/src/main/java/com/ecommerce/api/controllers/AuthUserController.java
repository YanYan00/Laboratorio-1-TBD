package com.ecommerce.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping
public class AuthUserController {
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterDTO user) {
        String response = userService.createUser(user);
        return ResponseEntity.created(new URI("/api/users/register")).body(response);
    }
}
