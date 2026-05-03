package com.ecommerce.api.controllers;

import com.ecommerce.api.dto.ProfileDTO;
import com.ecommerce.api.models.Profile;
import com.ecommerce.api.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {
    @Autowired
    private UsersRepository usersRepository;
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> myProfile(Authentication authentication) {
        String username = authentication.getName();
        Profile profile = usersRepository.findProfileByUsername(username);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profiles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> users() {
        List<ProfileDTO> profiles = usersRepository.findAllProfiles();
        return ResponseEntity.ok(profiles);
    }

}
