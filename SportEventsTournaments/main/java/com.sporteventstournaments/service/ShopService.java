package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.MatchSchedule;
import com.sporteventstournaments.domain.Shop;
import com.sporteventstournaments.domain.dto.ShopDTO;
import com.sporteventstournaments.exception.MatchScheduleNotFoundException;
import com.sporteventstournaments.exception.NoTicketsLeftException;
import com.sporteventstournaments.exception.ShopNotFoundException;
import com.sporteventstournaments.repository.MatchScheduleRepository;
import com.sporteventstournaments.repository.ShopRepository;
import com.sporteventstournaments.security.service.SecurityService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@AllArgsConstructor
public class ShopService {
    private final ShopRepository shopRepository;
    private final SecurityService securityService;
    private final MatchScheduleRepository matchScheduleRepository;
    private final Shop shop;

    public List<Shop> getShops(Principal principal) {
        return shopRepository.findAll();
    }

    public Shop getShop(Long id, Principal principal) {
        Shop shop =  shopRepository.findById(id).orElseThrow(ShopNotFoundException::new);
        if(shop.getUserId() != securityService.getUserIdByLogin(principal.getName())){
            return shop;
        }else {
            return null;
        }
    }
    public void createShop(ShopDTO shopDTO, Principal principal) {
        MatchSchedule matchSchedule = matchScheduleRepository.findById(shopDTO.getMatchId()).orElseThrow(MatchScheduleNotFoundException::new);
        long numberOfTickets = matchSchedule.getAvailableTickets();
        if( numberOfTickets != 0){
            matchSchedule.setAvailableTickets(numberOfTickets-1);
            matchScheduleRepository.saveAndFlush(matchSchedule);
            int size = shopRepository.findAll().size();
            shop.setId((long) (size+1));
            shop.setMatchId(shopDTO.getMatchId());
            shop.setUserId(securityService.getUserIdByLogin(principal.getName()));
            shopRepository.save(shop);
        } else{
            throw new NoTicketsLeftException();
        }
    }

    public void updateShop(Shop shop) {
        shopRepository.saveAndFlush(shop);
    }

    @Transactional
    public void deleteShopById(Long id){
        shopRepository.deleteById(id);
    }

}