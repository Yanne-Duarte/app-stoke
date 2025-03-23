package pt.uevora.fisio_stoke.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.http.HttpStatus;
import org.springframework.web.socket.server.HandshakeInterceptor;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat")
                .setAllowedOrigins("http://localhost:4200")
                .withSockJS()
                .setHeartbeatTime(25000)
                .setDisconnectDelay(5000)
                .setClientLibraryUrl("https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js")
                .setWebSocketEnabled(true)
                .setSessionCookieNeeded(false)
                .setStreamBytesLimit(512 * 1024) // 512KB
                .setHttpMessageCacheSize(1000)
                .setWebSocketEnabled(true);

        registry.addEndpoint("/chat")
                .setAllowedOrigins("http://localhost:4200")
                .addInterceptors(new HandshakeInterceptor() {
                    @Override
                    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, 
                            WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
                        String token = null;
                        List<String> authHeaders = request.getHeaders().get("Authorization");
                        
                        if (authHeaders != null && !authHeaders.isEmpty()) {
                            String authHeader = authHeaders.get(0);
                            if (authHeader.startsWith("Bearer ")) {
                                token = authHeader.substring(7);
                            }
                        }
                        
                        if (token == null) {
                            response.setStatusCode(HttpStatus.UNAUTHORIZED);
                            return false;
                        }
                        
                        // Store the token in the attributes for later use
                        attributes.put("token", token);
                        return true;
                    }

                    @Override
                    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, 
                            WebSocketHandler wsHandler, Exception exception) {
                    }
                });
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.setMessageSizeLimit(8192)
                   .setSendBufferSizeLimit(8192)
                   .setSendTimeLimit(10000);
    }
}
