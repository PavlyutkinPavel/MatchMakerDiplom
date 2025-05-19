package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.User;
import com.sporteventstournaments.domain.UserProfile;
import com.sporteventstournaments.domain.dto.UserProfileDTO;
import com.sporteventstournaments.exception.UserNotFoundException;
import com.sporteventstournaments.repository.UserProfileRepository;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@Tag(name = "User Controller", description = "Makes all operations with users")
@RestController
@AllArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final SecurityService securityService;
    private final UserProfile userProfile;
    private final UserProfileRepository userProfileRepository;

    @Operation(summary = "get all users(for admins)")
    @GetMapping
    public ResponseEntity<List<User>> getUsers(Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            List<User> users = userService.getUsers(principal);
            if (users.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(users, HttpStatus.OK);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "get user by last name(for all users)")
    @GetMapping("/last")
    public ResponseEntity<User> getUserByLastName(@RequestParam String lastName, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        User user = userService.findUserByLastName(lastName).orElseThrow(UserNotFoundException::new);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @Operation(summary = "get user by first name(for all users)")
    @GetMapping("/first")
    public ResponseEntity<User> getUserByFirstName(@RequestParam String firstName, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        User user = userService.findUserByFirstName(firstName).orElseThrow(UserNotFoundException::new);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @Operation(summary = "get user (for authorized users)")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        User user = userService.getUser(id, principal);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "update user (for authorized users)")
    @PutMapping
    public ResponseEntity<HttpStatus> updateUser(@RequestBody User user, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName()) || (securityService.getUserIdByLogin(principal.getName()) == user.getId())) {
            userService.updateUser(user);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "delete user (for authorized users)")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName()) || (securityService.getUserIdByLogin(principal.getName()) == id)) {
            userService.deleteUserById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/profiles")
    public ResponseEntity<List<UserProfile>> getUserProfiles(Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<UserProfile> userProfiles = userService.getUserProfiles();
        if (userProfiles.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(userProfiles, HttpStatus.OK);
        }
    }

    @Operation(summary = "get user_profile(for all)")
    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getUserProfile(Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        UserProfile userProfile = userService.getUserProfile(principal);
        if (userProfile != null) {
            return new ResponseEntity<>(userProfile, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "update user (for authorized users)")
    @PutMapping("/profile")
    public ResponseEntity<HttpStatus> updateUserProfile(@RequestBody UserProfileDTO userProfileDTO, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName()) || ((principal.getName()).equals(userProfileDTO.getUsername()))) {
            userService.updateUserProfile(userProfileDTO, principal);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "delete user (for authorized users)")
    @DeleteMapping("/profile")
    public ResponseEntity<HttpStatus> deleteUserProfile(Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        userService.deleteUserProfileByUsername(principal);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/avatar")
    public ResponseEntity<HttpStatus> uploadAvatar(@RequestParam("file") MultipartFile file, Principal principal) throws IOException {
        UserProfile user = userProfileRepository.findByUsername(principal.getName()).orElseThrow(UserNotFoundException::new);
        user.setAvatar(file.getBytes());
        userProfileRepository.save(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/avatar")
    public ResponseEntity<byte[]> getAvatar(Principal principal) {
        UserProfile user = userProfileRepository.findByUsername(principal.getName()).orElseThrow(UserNotFoundException::new);
        byte[] image = user.getAvatar();

        if (image == null || image.length == 0) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.ALL);
        return new ResponseEntity<>(image, headers, HttpStatus.OK);
    }
}
