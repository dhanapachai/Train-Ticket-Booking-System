package com.trainbooking.config;

import com.trainbooking.model.User;
import com.trainbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initAdminUser() {
        return args -> {
            // Create admin only if it doesn't already exist
            if (!userRepository.existsByEmail("admin@train.com")) {
                User admin = User.builder()
                        .name("Admin")
                        .email("admin@train.com")
                        .password(passwordEncoder.encode("admin123"))  // BCrypt at runtime
                        .role(User.Role.ADMIN)
                        .build();
                userRepository.save(admin);
                log.info("✅ Admin user created: admin@train.com / admin123");
            } else {
                log.info("ℹ️  Admin user already exists, skipping creation.");
            }
        };
    }
}
