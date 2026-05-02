package com.ecommerce.api.services;

import com.ecommerce.api.dto.SalesDTO;
import com.ecommerce.api.repositories.SalesRepository;
import com.ecommerce.api.repositories.UsersRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class SalesService {


    private final UsersRepository usersRepository;
    private final SalesRepository salesRepository;

    public SalesService(UsersRepository usersRepository,
                        SalesRepository salesRepository) {
        this.usersRepository = usersRepository;
        this.salesRepository = salesRepository;
    }


    public List<SalesDTO> getMySales() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        Long idUser = usersRepository.findIdByUsername(username);

        return salesRepository.findByUser(idUser);
    }
}
