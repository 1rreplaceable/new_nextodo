package com.example.nextodo.controller;

import com.example.nextodo.dto.MemberDTO;
import com.example.nextodo.service.MemberService;
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
public class MemberController {

    private final MemberService memberService;

    @PostMapping("nexodo/addmember")//친구 추가(멤버 추가)
    public ResponseEntity<?> addMembers(@RequestBody MemberDTO memberDTO, HttpSession session){
        log.info("멤버 추가 메서드");
        log.info("현재 사용자 : { }, 추가하려는 사용자 :{ }" + memberDTO.getUserId() + memberDTO.getMemberName());
        try{
            MemberDTO addMemebers = memberService.addMember(memberDTO);
            session.setAttribute("login UserId", addMemebers.getUserId());
            log.info("멤버 추가 성공");
            return ResponseEntity.ok(addMemebers);
        }catch(Exception e){
            log.error("Error : " + e.getMessage());
            //서버 내부에서 예기치 않은 오류가 발생했음을 나타낸다.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("멤버 추가 실패" + e.getMessage());
        }//try-catch end
    }//addMembers end

}