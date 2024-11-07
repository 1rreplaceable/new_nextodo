package com.example.nextodo.config;

// WebConfig.java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173") // Vite 개발 서버 주소 허용
                        .allowedMethods("GET", "POST", "PUT", "DELETE")// 모든 HTTP 메서드 허용 (GET, POST 등)
                        .allowedHeaders("*")// 모든 헤더 허용
                        .allowCredentials(true);// 인증 정보 (쿠키 등) 허용
            }
        };
    }
}

