package com.example.nextodo.controller;

import com.example.nextodo.dto.TodoDTO;
import com.example.nextodo.service.TodoService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TodoController {

    private final TodoService todoService;

    @PostMapping("nextodo/addtodo")//투두 추가
    public ResponseEntity<?> addTodo(@RequestBody TodoDTO todoDTO, HttpSession session){
        log.info("todoDTO : " + todoDTO);

        try {
            TodoDTO addTodoResult = todoService.addTodo(todoDTO);
            log.info("addTodoResult = " + addTodoResult);

            session.setAttribute("loginEmail", addTodoResult.getTodoId());
            log.info("일정추가 성공");

            return ResponseEntity.ok(addTodoResult);  // 성공적으로 추가된 TodoDTO 반환
        } catch (IllegalArgumentException e) {
            log.error("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("사용자를 찾을 수 없습니다: " + e.getMessage());  // 사용자 미존재
        } catch (RuntimeException e) {
            log.error("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("일정 추가 실패: " + e.getMessage());  // Todo 저장 실패
        }

//        TodoDTO addTodoResult = todoService.addTodo(todoDTO);
//        log.info("addTodoResult = " + addTodoResult);
//        if(addTodoResult != null){
//            //추가 성공
//            session.setAttribute("loginEmail", addTodoResult.getTodoId());
//            log.info("일정추가 성공");
//            return ResponseEntity.ok(addTodoResult);
//        }else{
//            //추가 실패
//            log.info("일정추가 실패");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("할일 추가 실패");//오류 메세지를 JSON 형식으로 반환
//        }
    }//addTodo end

    @GetMapping("nextodo/getalltodo")//전체 투두 가져오기
    //orderby endDate 내림차순
    public ResponseEntity<?> getAllTodo(@RequestParam Long userId){
        log.info("GetAllTodo userId : " + userId);

        try{
            //사용자 ID로 Todo목록을 가져옴
            List<TodoDTO> todoDTOList = todoService.getAllTodo(userId);
            // Todo 목록이 비었을 경우 처리
            if (todoDTOList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 사용자에 대한 Todo가 없습니다.");
            }
            return ResponseEntity.ok(todoDTOList);
        }catch (Exception e) {
            log.error("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("일정 조회 실패: " + e.getMessage()); // 조회 실패
        }
        //try-catch 필요
    }//getAllTodo



}