package com.sporteventstournaments;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition(
        info = @Info(
                title = "Sport events and tournaments organizer",
                description = "This is Java Spring Boot REST project for Sport Forum with many features",
                contact = @Contact(
                        name = "Pavel Pavlyutkin",
                        email = "paul@gmail.com",
                        url = "@paul"
                )

        )
)
@SpringBootApplication
public class SportEventsTournamentsApplication {

    public static void main(String[] args) {
        SpringApplication.run(SportEventsTournamentsApplication.class, args);
    }

}
