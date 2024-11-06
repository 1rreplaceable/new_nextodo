package com.example.nextodo.controller;

import com.example.nextodo.dto.UserDTO;
import com.example.nextodo.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;//생성자 주입

    @PostMapping("/nextodo/signup")//회원가입
    public void signup(@RequestBody UserDTO userDTO){//try catch 필요
        log.info("UserController signup");
        log.info("userDTO = " + userDTO);
        userService.signup(userDTO);
    }//signup end

    @PostMapping("/nextodo/login")//로그인
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO, HttpSession session){
        log.info("UserController login");
        log.info("userDTO = " + userDTO);
        UserDTO loginResult = userService.login(userDTO);
        log.info("loginResult = " + loginResult);
        if(loginResult != null){//로그인 성공
            session.setAttribute("loginEmail", loginResult.getUserEmail());//HTTP세션에 사용자 정보를 저장하는 코드. //SetAttribute는 Key-Value로 이루어진 세션에 값을 저장하는 역할.
            log.info("UserController login success");
            return ResponseEntity.ok(loginResult);//HTTP 200 OK 상태 코드와 함께 응답을 반환하는 메소드. 서버가 요청을 정상적으로 처리했음을 클라이언트에게 알림.
        }else{//로그인 실패
            log.info("UserController login failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");//오류 메시지를 JSON 형식으로 반환
        }//if-else end
    }//login end

}//class end
//세션이란?
//브라우저에 저장하기 곤란한 정보들을 서버 측에서 가지고 있는 것