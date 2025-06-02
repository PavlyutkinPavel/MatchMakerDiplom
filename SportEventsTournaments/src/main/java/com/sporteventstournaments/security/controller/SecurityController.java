package com.sporteventstournaments.security.controller;

import com.sporteventstournaments.domain.User;
import com.sporteventstournaments.security.domain.AdminDTO;
import com.sporteventstournaments.security.domain.AuthRequest;
import com.sporteventstournaments.security.domain.AuthResponse;
import com.sporteventstournaments.security.domain.RegistrationDTO;
import com.sporteventstournaments.security.domain.ResendCodeDTO;
import com.sporteventstournaments.security.domain.ResetPasswordDTO;
import com.sporteventstournaments.security.domain.VerificationRegistrationDTO;
import com.sporteventstournaments.security.domain.VerificationRequestDTO;
import com.sporteventstournaments.security.service.SecurityService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.security.Principal;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class SecurityController {

    private final SecurityService securityService;
    private final User user;

    public SecurityController(SecurityService securityService, User user) {
        this.securityService = securityService;
        this.user = user;
    }

    /**
     * 1. generate JWT if all is good
     *    2. return 401 code if all is bad
     * */
    @PostMapping("/authentication")
    public ResponseEntity<AuthResponse> generateToken(@RequestBody AuthRequest authRequest){

        String token = securityService.generateToken(authRequest);
        Long userId = securityService.getUserIdByEmail(authRequest.getEmail());
        if (token.isBlank() || token.isEmpty()){
            return new ResponseEntity<>(new AuthResponse("Provided email is not registered. Or wrong password. Please try sign up", userId),HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(new AuthResponse(token, userId), HttpStatus.OK);
    }

    @PostMapping("/registration")
    public ResponseEntity<String> registration(@RequestBody RegistrationDTO registrationDTO, HttpServletRequest request) throws MessagingException, UnsupportedEncodingException {
        return securityService.registration(registrationDTO, getSiteURL(request));
    }

    @PostMapping("/verification")
    public ResponseEntity<String> verifyRegistration(@RequestBody VerificationRegistrationDTO verificationCode){
        return securityService.verifyRegistration(verificationCode);
    }

    @PostMapping("/verification_rq")
    public ResponseEntity<String> verifyRequest(@RequestBody VerificationRequestDTO verificationCode){
        return securityService.verifyRequest(verificationCode);
    }

    @PostMapping("/resend_code")
    public ResponseEntity<String> resendCode(@RequestBody ResendCodeDTO resendCodeDTO) throws MessagingException, UnsupportedEncodingException {
        return securityService.resendCode(resendCodeDTO);
    }

    @PostMapping("/reset_password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        return securityService.resetPassword(resetPasswordDTO);
    }

    @PostMapping("/admin")
    public ResponseEntity<HttpStatus> admin(@RequestBody AdminDTO adminDTO, Principal principal){
        securityService.authorizeAdmin(adminDTO, principal);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private String getSiteURL(HttpServletRequest request) {
        String siteURL = request.getRequestURL().toString();
        return siteURL.replace(request.getServletPath(), "");
    }
}