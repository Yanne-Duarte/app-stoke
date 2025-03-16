package pt.uevora.fisio_stoke.configs;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import pt.uevora.fisio_stoke.services.impl.JwtService;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService,
            HandlerExceptionResolver handlerExceptionResolver
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            final String authHeader = request.getHeader("Authorization");
            System.out.println("Request URL: " + request.getRequestURL());
            System.out.println("Auth Header: " + authHeader);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("No valid Authorization header found");
                filterChain.doFilter(request, response);
                return;
            }

            final String jwt = authHeader.substring(7);
            final String username = jwtService.extractUsername(jwt);
            System.out.println("JWT User: " + username);

            Authentication existingAuth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Existing Authentication: " + existingAuth);

            if (username != null && existingAuth == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                System.out.println("Loaded UserDetails: " + userDetails);
                System.out.println("User Authorities: " + userDetails.getAuthorities());

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("Authentication set in SecurityContext: " + authToken);
                    System.out.println("Authorities in SecurityContext: " + authToken.getAuthorities());
                } else {
                    System.out.println("Token validation failed");
                }
            }

            filterChain.doFilter(request, response);
        } catch (Exception exception) {
            System.err.println("Error in JWT filter: " + exception.getMessage());
            exception.printStackTrace();
            handlerExceptionResolver.resolveException(request, response, null, exception);
        }
    }
}