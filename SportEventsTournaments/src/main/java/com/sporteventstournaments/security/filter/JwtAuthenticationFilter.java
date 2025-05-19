package com.sporteventstournaments.security.filter;

import com.sporteventstournaments.security.CustomUserDetailService;
import com.sporteventstournaments.security.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor//создает конструктор только из финальных полей
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailService customUserDetailService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        //1.get token
        //2.check token
        //3. if all is ok -> put User object in SpringContext
        String token = jwtUtils.getTokenFromHttpRequest(request);

        if(token != null && jwtUtils.validateJwtToken(token)){
            String email = jwtUtils.getEmailFromJwt(token);
            UserDetails userDetails = customUserDetailService.loadUserByUsername(email);
            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            log.info("Authenticated user with email: " + email);
        }
        filterChain.doFilter(request, response);
    }
}
