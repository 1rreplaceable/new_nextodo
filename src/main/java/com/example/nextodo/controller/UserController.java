package com.example.nextodo.controller;

import com.example.nextodo.dto.UserDTO;
import com.example.nextodo.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");//오류 메시지를 JSON 형식으로 반환.
        }//if-else end
    }//login end

    @GetMapping("nextodo/getallusers")
    public ResponseEntity<?> getAllUsers(@RequestParam Long userId){//그룹 멤버 추가 시 전체 사용자 불러오기
        log.info("MemberController.getAllUsers");
        try{
            List<UserDTO> allUserList = userService.getAllUsers(userId);
            log.info("allUserList = " + allUserList);
            // 현재 사용자를 제외한 목록으로 필터링
            List<UserDTO> filteredUserList = allUserList.stream()
                    .filter(user -> !user.getUserId().equals(userId))//userId가 현재 사용자와 다르면 필터링
                        .collect(Collectors.toList());
            return ResponseEntity.ok(allUserList);
        }catch(Exception e){
            log.error("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("전체 사용자 조회 실패: " + e.getMessage());//조회 실패
        }//try-catch end
    }//getAllUsers end

}//class end
/*
세션이란?
브라우저에 저장하기 곤란한 정보들을 서버 측에서 가지고 있는 것
*
ResponseEntity는 Spring에서 HTTP응답을 생성하고, 상태 코드(200, 500, 400 ...)와 (오류메시지 또는 데이터) 클라이언트에게 반환하는 객체
*
INTERNAL_SERVER_ERROR?
응답 상태 코드를 500으로 설정하는 메서드. 서버에서 처리할 수 없는 오류가 발생했을 때 일반적으로 사용되는 HTTP 상태 코드
즉, HttpStatus.INTERNAL_SERVER_ERROR는 HTTP상태 코드 500에 해당하며 서버 오류를 나타낸다. 서버에서 요청을 처리하는 도중 예기치 않은 문제가 발생했을 때 이 상태코드가 사용.
body()메서드는 HTTP응답 본문을 설정.
*
스트림?(Stream)
데이터 컬렉션을 순차적으로 처리할 수 있도록 도와주는 기능.
stream()메서드는 List객체에서 데이터를 하나씩 순차적으로 처리할 수 있게 스트림을 반환.
*
collect()는 스트림에서 처리한 데이터를 최종적으로 컬렉션으로 변환하는 메서드
*
Collectors.toList()는 스트림의 모든 요소를 새로운 List로 수집하는 역할.
*/