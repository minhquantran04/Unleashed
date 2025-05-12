package com.unleashed;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication()
@EnableAsync
@Configuration
public class unleashedApplication {

//    @Value("${PAYOS_CLIENT_ID}")
//    private String clientId;
//
//    @Value("${PAYOS_API_KEY}")
//    private String apiKey;
//
//    @Value("${PAYOS_CHECKSUM_KEY}")
//    private String checksumKey;
//
//    @Bean
//    public PayOS payOS() {
//        return new PayOS(clientId, apiKey, checksumKey);
//    }

    public static void main(String[] args) {
        SpringApplication.run(unleashedApplication.class, args);

//		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(BCryptPasswordEncoder.BCryptVersion.$2A, 10);
//		System.out.println(encoder.encode("password12345"));


    }
}
