package com.sporteventstournaments.security.service;


import com.sporteventstournaments.domain.InGameRole;
import com.sporteventstournaments.domain.Role;
import com.sporteventstournaments.domain.User;
import com.sporteventstournaments.domain.UserProfile;
import com.sporteventstournaments.exception.UserNotFoundException;
import com.sporteventstournaments.repository.UserProfileRepository;
import com.sporteventstournaments.repository.UserRepository;
import com.sporteventstournaments.security.CustomUserDetailService;
import com.sporteventstournaments.security.JwtUtils;
import com.sporteventstournaments.security.domain.AdminDTO;
import com.sporteventstournaments.security.domain.AuthRequest;
import com.sporteventstournaments.security.domain.RegistrationDTO;
import com.sporteventstournaments.security.domain.ResendCodeDTO;
import com.sporteventstournaments.security.domain.ResetPasswordDTO;
import com.sporteventstournaments.security.domain.SecurityCredentials;
import com.sporteventstournaments.security.domain.VerificationRegistrationDTO;
import com.sporteventstournaments.security.domain.VerificationRequestDTO;
import com.sporteventstournaments.security.repository.SecurityCredentialsRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Slf4j
@AllArgsConstructor
public class SecurityService {

    private final PasswordEncoder passwordEncoder;
    private final SecurityCredentialsRepository securityCredentialsRepository;
    private final JwtUtils jwtUtils;
    private final User user;
    private final UserProfile userProfile;
    private final UserProfileRepository userProfileRepository;
    private final JavaMailSender mailSender;
    private final SecurityCredentials securityCredentials;
    private final UserRepository userRepository;
    private final CustomUserDetailService customUserDetailService;

    public String generateToken(AuthRequest authRequest){
        //1. get User by login
        //2. check passwords
        //3. generate token by login
        //4. if all is bad then return empty string ""
        User userResult = userRepository.findByEmail(authRequest.getEmail()).orElseThrow(UserNotFoundException::new);

        Optional<SecurityCredentials> credentials = securityCredentialsRepository.findByUserLogin(userResult.getUserLogin());
        if (credentials.isPresent() && passwordEncoder.matches(authRequest.getPassword(),credentials.get().getUserPassword())){
            return jwtUtils.generateJwtToken(authRequest.getEmail());
        }

        return "";
    }

    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<String> registration(RegistrationDTO registrationDTO, String siteURL) throws MessagingException, UnsupportedEncodingException {
        //1. parse DTO
        //2. create User+SecurityCredentials
        //3. make transaction and execution

        user.setFirstName(registrationDTO.getFirstName());
        user.setLastName(registrationDTO.getLastName());
        user.setCreatedAt(LocalDateTime.now());
        user.setEmail(registrationDTO.getEmail());
        user.setUserLogin(registrationDTO.getUserLogin());
        user.setInGameRole(InGameRole.valueOf(registrationDTO.getInGameRole().toUpperCase()));

        //Long userId = userRepository.getNextSequenceValue();
        //user.setId(userId);

        userProfile.setId(userProfileRepository.getNextSequenceValue());
        userProfile.setName(registrationDTO.getFirstName() + " " + registrationDTO.getLastName());
        userProfile.setUsername(registrationDTO.getUserLogin());
        userProfile.setBio("-");
        userProfile.setLocation("-");
        userProfile.setEmail(registrationDTO.getEmail());
        userProfile.setMemberSince(LocalDate.now());


        String returnMessage;
        if(userRepository.findByEmail(registrationDTO.getEmail()).isPresent()){
            returnMessage = "Email is already registered. Please choose a different email or try sign in";
            log.error(returnMessage);
            return new ResponseEntity<>(returnMessage, HttpStatus.CONFLICT);
        } else if (userRepository.findByUserLogin(registrationDTO.getUserLogin()).isPresent()) {
            returnMessage = "Username is already registered. Please choose a different username or try sign in";
            log.error(returnMessage);
            return new ResponseEntity<>(returnMessage, HttpStatus.CONFLICT);
        } else{
            userRepository.save(user);
            User userResult = userRepository.findByUserLogin(registrationDTO.getUserLogin()).orElseThrow(UserNotFoundException::new);

            userProfile.setUser_id(userResult.getId());
            userProfileRepository.save(userProfile);
            securityCredentials.setUserLogin(registrationDTO.getUserLogin());
            securityCredentials.setUserPassword(passwordEncoder.encode(registrationDTO.getUserPassword()));
            securityCredentials.setUserRole(Role.USER);
            securityCredentials.setUserId(userResult.getId());
            //securityCredentials.setId(securityCredentialsRepository.getNextSequenceValue());
            //mail
            String randomCode = generateRandomString(6);
            securityCredentials.setVerificationCode(randomCode);
            securityCredentials.setEnabled(false);
            securityCredentials.setVerifiedRq(false);
            securityCredentialsRepository.save(securityCredentials);

            sendVerificationEmail(securityCredentials, siteURL, randomCode);

            returnMessage = "Registered successfully";
            return new ResponseEntity<>(returnMessage, HttpStatus.CREATED);
        }
    }

    private void sendVerificationEmail(SecurityCredentials securityCredentials, String siteURL, String verificationCode) throws UnsupportedEncodingException, MessagingException {
        User user = userRepository.findByUserLogin(securityCredentials.getUserLogin()).orElseThrow(UserNotFoundException::new);
        String toAddress = user.getEmail();
        String fromAddress = "paullpp1092@gmail.com";
        String senderName = "MatchMaker";
        String subject = "Please verify your registration";
        String content = "Dear [[name]],<br>"
                + "Please enter this code on our website to verify your registration:<br>"
                + "<h3>" + "[[URL]]" + "</h3>"
                + "Thank you,<br>" + "MatchMaker.";
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);
        content = content.replace("[[name]]", securityCredentials.getUserLogin());
        String verifyURL;
        if(verificationCode != null){
            verifyURL = securityCredentials.getVerificationCode();
        }
        else{
            securityCredentials.setVerificationCode(generateRandomString(6));
            verifyURL = securityCredentials.getVerificationCode();
            securityCredentialsRepository.saveAndFlush(securityCredentials);
        }
        content = content.replace("[[URL]]", verifyURL);
        helper.setText(content, true);
        mailSender.send(message);
    }

    public ResponseEntity<String> resendCode(ResendCodeDTO resendCodeDTO) throws MessagingException, UnsupportedEncodingException {
        User user = userRepository.findByEmail(resendCodeDTO.getEmail()).orElseThrow(UserNotFoundException::new);
        SecurityCredentials securityCredentials = securityCredentialsRepository.findByUserLogin(user.getUserLogin()).orElseThrow(UserNotFoundException::new);
        sendVerificationEmail(securityCredentials, "https://matchmaker", securityCredentials.getVerificationCode());
        return new ResponseEntity<>("Resend code successfully", HttpStatus.OK);
    }

    public ResponseEntity<String> resetPassword(ResetPasswordDTO resetPasswordDTO){
        User user = userRepository.findByEmail(resetPasswordDTO.getEmail()).orElseThrow(UserNotFoundException::new);
        SecurityCredentials securityCredentials = securityCredentialsRepository.findByUserLogin(user.getUserLogin()).orElseThrow(UserNotFoundException::new);
        securityCredentials.setUserPassword(passwordEncoder.encode(resetPasswordDTO.getNewPassword()));
        securityCredentialsRepository.saveAndFlush(securityCredentials);
        return new ResponseEntity<>("Password reset successfully", HttpStatus.OK);
    }

    private static final String CHARACTERS = "0123456789";

    public static String generateRandomString(int length) {
        Random random = new Random();
        return random.ints(0, CHARACTERS.length())
                .limit(length)
                .mapToObj(i -> String.valueOf(CHARACTERS.charAt(i)))
                .collect(Collectors.joining());
    }

    public ResponseEntity<String> verifyRequest(VerificationRequestDTO verificationDTO) {
        System.out.println(verificationDTO);
        if(verificationDTO.getVerificationCode().isEmpty()){
            return new ResponseEntity<>("Verification code is empty", HttpStatus.BAD_REQUEST);
        }
        SecurityCredentials securityCredentials = securityCredentialsRepository.findByVerificationCode(verificationDTO.getVerificationCode()).orElseThrow(UserNotFoundException::new);
        if("true".equals(verificationDTO.getIsRedirectRequired())){
            securityCredentials.setVerificationCode(null);
            securityCredentials.setVerifiedRq(true);
            securityCredentialsRepository.saveAndFlush(securityCredentials);
            return new ResponseEntity<>("Continue with password reset", HttpStatus.FOUND);
        }
        else{
            securityCredentials.setVerificationCode(null);
            securityCredentials.setVerifiedRq(true);
            securityCredentialsRepository.saveAndFlush(securityCredentials);
            return new ResponseEntity<>("Verification is successful", HttpStatus.OK);
        }

    }

    public ResponseEntity<String> verifyRegistration(VerificationRegistrationDTO verificationDTO) {
        System.out.println(verificationDTO);
        if(verificationDTO.getVerificationCode().isEmpty()){
            return new ResponseEntity<>("Verification code is empty", HttpStatus.BAD_REQUEST);
        }
        SecurityCredentials securityCredentials = securityCredentialsRepository.findByVerificationCode(verificationDTO.getVerificationCode()).orElseThrow(UserNotFoundException::new);

        if (customUserDetailService.isEnabled(securityCredentials) || securityCredentials.getVerificationCode().isEmpty() || securityCredentials.getVerificationCode().equals("null")) {
            return new ResponseEntity<>("Verification code is empty or user already verified", HttpStatus.BAD_REQUEST);
        } else {
            securityCredentials.setVerificationCode(null);
            securityCredentials.setEnabled(true);
            securityCredentialsRepository.saveAndFlush(securityCredentials);
            return new ResponseEntity<>("Verification is successful", HttpStatus.OK);
        }

    }

    public Boolean checkIfAdmin(String login){
        Optional<SecurityCredentials> credentials = securityCredentialsRepository.findByUserLogin(login);
        return credentials.isPresent() && credentials.get().getUserRole().toString().equals("ADMIN");
    }

    public void authorizeAdmin(AdminDTO adminDTO, Principal principal){
        String adminPassword = "admin";
        log.info(adminDTO.getAdminPassword());
        if(adminPassword.equals(adminDTO.getAdminPassword())){
            SecurityCredentials securityCredentials = securityCredentialsRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
            securityCredentials.setUserRole(Role.ADMIN);
            securityCredentialsRepository.save(securityCredentials);
        }else {
            log.info("User "+ principal.getName() + " tried to become admin");
        }
    }

    public String getUserByLogin(String login){
        SecurityCredentials credentials = securityCredentialsRepository.findByUserLogin(login).orElseThrow(UserNotFoundException::new);
        if (credentials != null){
            return credentials.getUserLogin();
        }else{
            return "";
        }
    }

    public Long getUserIdByLogin(String login){
        String username  = getUserByLogin(login);
        SecurityCredentials credentials = securityCredentialsRepository.findUserIdByLogin(username).orElseThrow(UserNotFoundException::new);
        if (credentials != null){
            return credentials.getUserId();
        }else{
            return 0L;
        }
    }
}
