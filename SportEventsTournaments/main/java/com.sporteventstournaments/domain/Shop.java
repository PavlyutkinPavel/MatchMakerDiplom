package com.sporteventstournaments.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Entity(name = "shop")
@Data
public class Shop {
    @Id
    @SequenceGenerator(name = "shopSeqGen", sequenceName = "shop_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "shopSeqGen")
    private Long id;

    @Column(name = "match_id")
    private Long matchId;

    @Column(name = "user_id")
    private Long userId;
}