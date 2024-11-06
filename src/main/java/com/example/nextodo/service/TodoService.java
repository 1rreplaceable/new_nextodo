package com.example.nextodo.service;

import com.example.nextodo.dto.TodoDTO;
import com.example.nextodo.entity.Todo;
import com.example.nextodo.entity.Users;
import com.example.nextodo.repository.TodoRepository;
import com.example.nextodo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TodoService {

    public final TodoRepository todoRepository;
    public final UserRepository userRepository;

    public TodoDTO addTodo(TodoDTO todoDTO){
        log.info("TodoService.addTodo method = " + todoDTO);
        //userId로 Users 엔티티 조회
        //.orElseThrow()는 Optional메서드. Optional안에 값이 존재하면 그 값을 반환하고, 존재하지 않으면 지정된 예외를 던진다.
        //여기서는 Optional안에 Users엔터티가 존재하지 않을 경우 IllegalArgumentException을 던지도록 설정
        //여기서는 필요없을 수도 있음. 나중에 삭제 여부 결정 >> 필요함. 외래키 문제 해결하기 위해. 정확한 이유는,....
        Users user = userRepository.findById(todoDTO.getUserId()).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Todo todo = Todo.toTodoEntity(todoDTO);
        todo.setUser(user);
        try {
            todoRepository.save(todo);
        } catch (Exception e) {
            log.error("일정 추가에 실패했습니다. " + e.getMessage());
            throw new RuntimeException("Failed to save Todo");
        }//try-catch end
        return TodoDTO.toTodoDTO(todo);
    }//addTodo end

    public List<TodoDTO> getAllTodo(Long userId){
        log.info("TodoService.getAllTodo & userId : " + userId);
        // userId로 Users 엔티티 조회
        Users user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        //해당 User의 Todo 목록 조회
        List<Todo> todos = todoRepository.findByUser(user, Sort.by(Sort.Order.desc("endDate")));
        //투두 목록을 TodoDTO로 변환하여 반환
        return todos.stream().map(TodoDTO::toTodoDTO).collect(Collectors.toList());
    }//getAllTodo end

    public void completeTodos(List<Long> todoIds) {
        List<Todo> todosToUpdate = todoRepository.findAllById(todoIds);
        for (Todo todo : todosToUpdate) {//선택된 모든 항목 완료 상태로 변경
            todo.setComplete("true");
        }//for end
        todoRepository.saveAll(todosToUpdate);//변경된 투두 목록을 저장
    }//completeTodos end

}//class end