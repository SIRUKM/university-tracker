package com.upkar.unitracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS using the configuration below
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Disable CSRF as we are using stateless JWTs
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                // Require a valid token for all application data requests
                .requestMatchers("/api/applications/**").authenticated()
                // Allow all other requests to pass through normally
                .anyRequest().permitAll()
            )
            // Tell Spring Security to validate JWTs as an OAuth2 Resource Server
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}));
            
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Explicitly allow both your local React environment and your live Render UI
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173", 
            "https://uni-tracker-ui.onrender.com"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
