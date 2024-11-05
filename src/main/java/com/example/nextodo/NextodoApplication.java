package com.example.nextodo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.nextodo.repository") // 패키지 지정
public class NextodoApplication {

	public static void main(String[] args) {
		SpringApplication.run(NextodoApplication.class, args);
	}

}
