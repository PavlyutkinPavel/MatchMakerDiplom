package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Role;
import com.sporteventstournaments.domain.User;
import com.sporteventstournaments.domain.UserProfile;
import com.sporteventstournaments.domain.dto.UserProfileDTO;
import com.sporteventstournaments.exception.UserNotFoundException;
import com.sporteventstournaments.repository.UserProfileRepository;
import com.sporteventstournaments.repository.UserRepository;
import com.sporteventstournaments.security.domain.SecurityCredentials;
import com.sporteventstournaments.security.repository.SecurityCredentialsRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private UserProfile userProfile;
    private final UserProfileRepository userProfileRepository;
    private final SecurityCredentialsRepository securityCredentialsRepository;

    public List<User> getUsers(Principal principal) {
        return userRepository.findAll();
    }

    public Optional<User> findUserByLastName(String lastName) {
        return userRepository.findByLastName(lastName);
    }

    public Optional<User> findUserByLogin(String login) {
        return userRepository.findByUserLogin(login);
    }

    public Optional<User> findUserByFirstName(String firstName) {
        return userRepository.findByFirstName(firstName);
    }

    public User getUser(Long id, Principal principal) {
        SecurityCredentials credentials = securityCredentialsRepository.findUserIdByLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        Long currentUserId = credentials.getUserId();
        User user =  userRepository.findById(id).orElseThrow(UserNotFoundException::new);
        Role role = credentials.getUserRole();
        if((currentUserId == user.getId()) || (role.toString().equals("ADMIN"))){
            return user;
        }else{
            return null;
        }
    }
    public void updateUser(User user) {
        userRepository.saveAndFlush(user);
    }

    @Transactional
    public void deleteUserById(Long id){
        userRepository.deleteById(id);
    }

    public List<UserProfile> getUserProfiles() {
        return userProfileRepository.findAll();
    }

    public UserProfile getUserProfile(Principal principal){
        System.out.println(principal.getName());
        return userProfileRepository.findByUsername(principal.getName()).orElseThrow(UserNotFoundException::new);
    }

    public void updateUserProfile(UserProfileDTO userProfileDTO, Principal principal) {
        userProfile = userProfileRepository.findByUsername(principal.getName()).orElseThrow(UserNotFoundException::new);
        userProfile.setName(userProfileDTO.getName());
        userProfile.setUsername(userProfileDTO.getUsername());
        userProfile.setBio(userProfileDTO.getBio());
        userProfile.setLocation(userProfileDTO.getLocation());
        userProfile.setEmail(userProfileDTO.getEmail());
        userProfileRepository.saveAndFlush(userProfile);
    }

    @Transactional
    public void deleteUserProfileByUsername(Principal principal){
        userProfileRepository.deleteByUsername(principal.getName());
    }

}
