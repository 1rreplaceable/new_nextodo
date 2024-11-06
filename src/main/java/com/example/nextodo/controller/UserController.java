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
    //try catch 필요
    public void signup(@RequestBody UserDTO userDTO){
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
            session.setAttribute("loginEmail", loginResult.getUserEmail());
            log.info("UserController login success");
            return ResponseEntity.ok(loginResult); // 사용자 데이터를 JSON 형식으로 반환
        }else{//로그인 실패
            log.info("UserController login failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");//오류 메시지를 JSON 형식으로 반환
        }//if-else end
    }//login end

}//class end