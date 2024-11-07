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
    public ResponseEntity<?> addTodo(@RequestBody TodoDTO todoDTO, HttpSession session){//HTTP 응답을 반환할 때 사용하는 제네릭 타입
        log.info("todoDTO : " + todoDTO);
        try {
            TodoDTO addTodoResult = todoService.addTodo(todoDTO);
            log.info("addTodoResult = " + addTodoResult);
            session.setAttribute("loginEmail", addTodoResult.getTodoId());
            log.info("일정추가 성공");
            return ResponseEntity.ok(addTodoResult);//성공적으로 추가된 TodoDTO 반환
        }catch (RuntimeException e) {
            log.error("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("일정 추가 실패: " + e.getMessage());//투두 저장 실패
        }//trt-catch end
    }//addTodo end

    @GetMapping("nextodo/getalltodo")//전체 투두 가져오기
    //orderby endDate 내림차순
    public ResponseEntity<?> getAllTodo(@RequestParam Long userId){
        log.info("GetAllTodo userId : " + userId);
        try{//사용자 ID로 Todo목록을 가져옴
            List<TodoDTO> todoDTOList = todoService.getAllTodo(userId);
            if (todoDTOList.isEmpty()) {// Todo 목록이 비었을 경우 처리
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 사용자에 대한 Todo가 없습니다.");
            }//if end
            return ResponseEntity.ok(todoDTOList);
        }catch (Exception e) {
            log.error("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("일정 조회 실패: " + e.getMessage());//조회 실패
        }//try-catch end
    }//getAllTodo end

    @PutMapping("nextodo/complete")//할일 완료
    public ResponseEntity<?> completeTodo(@RequestBody List<Long> todoId) {
        log.info("TodoController.completeTodo & TodoId = " + todoId);
        try { // 여러 개의 Todo 아이디로 완료 상태를 업데이트
            todoService.completeTodos(todoId);
            return ResponseEntity.ok("Todo 완료 상태 업데이트 완료");
        }catch (Exception e) {//HttpStatus.INTERNAL_SERVER_ERROR는 예외처리를 자동으로 해준다. 400에러인지 500에러인지를 자동으로 출력.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Todo 완료 상태 업데이트 실패: " + e.getMessage());
        }//try-catch end
    }//completeTodo end

    @GetMapping("nextodo/getmemberstodo")
    public ResponseEntity<?> getMemberTodo(@RequestParam String memberName){
        log.info("선택한 멤버 : " + memberName);
        try{
            List<TodoDTO> membersTodoList = todoService.getMemberTodo(memberName);
            if(membersTodoList.isEmpty()) {//멤버의 투두가 비어있을 경우
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 사용자에 대한 Todo가 없습니다.");
            }
            return ResponseEntity.ok(membersTodoList);
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("할 일 불러오기 실패: " + e.getMessage());//조회 실패
        }//try-catch end
    }//getMemberTodo end

}//class end