package pt.uevora.fisio_stoke.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {
        private final AuthenticationProvider authenticationProvider;
        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfiguration(
                        JwtAuthenticationFilter jwtAuthenticationFilter,
                        AuthenticationProvider authenticationProvider) {
                this.authenticationProvider = authenticationProvider;
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                    .csrf(csrf -> csrf.disable())
                    .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                    .authorizeHttpRequests(auth -> auth
                        // API endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/**").authenticated()
                        // Swagger/OpenAPI endpoints
                        .requestMatchers(
                            "/v3/api-docs/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html"
                        ).permitAll()
                        // Frontend resources and routes
                        .requestMatchers(
                            "/",
                            "/index.html",
                            "/*.js",
                            "/*.css",
                            "/*.ico",
                            "/assets/**",
                            "/error",
                            // Angular app routes from your configuration
                            "/login",
                            "/dashboard/**",
                            "/users/**",
                            "/settings/**",
                            "/reports/**",
                            "/plano/**",
                            "/mensagens/**",
                            "/sessao/**",
                            "/gravacoes/**",
                            "/notificacoes/**",
                            "/criar-conteudo/**"
                        ).permitAll()
                        .anyRequest().permitAll()
                    )
                    .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    )
                    .authenticationProvider(authenticationProvider)
                    .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(List.of("http://localhost:4200"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/api/**", configuration);

                return source;
        }
}