package com.trainbooking.service;

import com.trainbooking.model.User;
import com.trainbooking.repository.UserRepository;
import com.trainbooking.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    // ── UserDetailsService ─────────────────────────────────────────────────
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    // ── Register ───────────────────────────────────────────────────────────
    public Map<String, Object> register(String name, String email, String password) {
        if (userRepo.existsByEmail(email)) {
            throw new RuntimeException("Email already registered.");
        }
        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(User.Role.USER)
                .build();
        userRepo.save(user);

        UserDetails ud = loadUserByUsername(email);
        String token = jwtUtil.generateToken(ud, user.getRole().name());
        return Map.of("token", token, "role", user.getRole(), "name", user.getName(), "email", user.getEmail());
    }

    // ── Login ──────────────────────────────────────────────────────────────
    public Map<String, Object> login(String email, String password) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        UserDetails ud = loadUserByUsername(email);
        String token = jwtUtil.generateToken(ud, user.getRole().name());
        return Map.of("token", token, "role", user.getRole(), "name", user.getName(), "email", user.getEmail());
    }
}
