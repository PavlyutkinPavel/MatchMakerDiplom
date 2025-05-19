package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.Shop;
import com.sporteventstournaments.domain.User;
import com.sporteventstournaments.domain.dto.ShopDTO;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.ShopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@Tag(name = "Shop Controller", description = "Makes all operations with Shop")
@RestController
@AllArgsConstructor
@RequestMapping("/shop")
public class ShopController {

    private final ShopService shopService;
    private final SecurityService securityService;

    @Operation(summary = "get all Shops(for admins)")
    @GetMapping
    public ResponseEntity<List<Shop>> getShopList(Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            List<Shop> shops = shopService.getShops(principal);
            if (shops.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(shops, HttpStatus.OK);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }

    @Operation(summary = "get Shop (for authorized users)")
    @GetMapping("/{id}")
    public ResponseEntity<Shop> getShop(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Shop shop = shopService.getShop(id, principal);
        if (shop != null) {
            return new ResponseEntity<>(shop, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @Operation(summary = "create Shop (for all users)")

    @PostMapping
    public ResponseEntity<HttpStatus> createShop(@RequestBody ShopDTO shopDTO, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        shopService.createShop(shopDTO, principal);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }


    @Operation(summary = "update Shop (for authorized users)")
    @PutMapping
    public ResponseEntity<HttpStatus> updateShop(@RequestBody Shop shop, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            shopService.updateShop(shop);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "delete Shop (for authorized users)")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteShop(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            shopService.deleteShopById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

}
