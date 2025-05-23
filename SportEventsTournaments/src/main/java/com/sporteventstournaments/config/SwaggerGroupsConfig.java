package com.sporteventstournaments.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerGroupsConfig {

    @Bean
    public GroupedOpenApi eventsGroup() {
        return GroupedOpenApi.builder()
                .group("Events")
                .packagesToScan("com.sporteventstournaments.controller.events")
                .build();
    }

    @Bean
    public GroupedOpenApi usersGroup() {
        return GroupedOpenApi.builder()
                .group("AUTH")
                .packagesToScan("com.sporteventstournaments.security.controller")
                .build();
    }

    @Bean
    public GroupedOpenApi allGroup() {
        return GroupedOpenApi.builder()
                .group("All")
                .packagesToScan("com.sporteventstournaments.controller")
                .build();
    }
}
