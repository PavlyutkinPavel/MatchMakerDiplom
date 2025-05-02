package com.sporteventstournaments.security;

import com.sporteventstournaments.exception.UserNotFoundException;
import com.sporteventstournaments.repository.UserRepository;
import com.sporteventstournaments.security.domain.SecurityCredentials;
import com.sporteventstournaments.security.repository.SecurityCredentialsRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final SecurityCredentialsRepository securityCredentialsRepository;
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String username = userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new).getUserLogin();
        Optional<SecurityCredentials> securityCredentials = securityCredentialsRepository.findByUserLogin(username);
        if(securityCredentials.isEmpty()){
            throw new UsernameNotFoundException(username);//401 нужно кидать
        }
        return User
                .withUsername(securityCredentials.get().getUserLogin())
                .password(securityCredentials.get().getUserPassword())
                .roles(securityCredentials.get().getUserRole().toString())
                .build();
    }

    public boolean isEnabled(SecurityCredentials securityCredentials) {
        return securityCredentials.getEnabled();
    }

    public boolean isVerifiedRq(SecurityCredentials securityCredentials) {
        return securityCredentials.getVerifiedRq();
    }

}
