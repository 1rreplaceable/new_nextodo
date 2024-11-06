package com.example.nextodo.dto;

import com.example.nextodo.entity.Todo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import java.sql.Date;

@Slf4j
@Getter
@Setter
@NoArgsConstructor
@ToString
public class TodoDTO {
    private Long todoId;
    private String title;
    private String complete;
    private Date startDate;
    private Date endDate;
    private Long userId;//FK

    public static TodoDTO toTodoDTO(Todo todo){
        TodoDTO todoDTO = new TodoDTO();
        todoDTO.setTodoId(todo.getTodoId());
        todoDTO.setTitle(todo.getTitle());
        todoDTO.setComplete(todo.getComplete());
        todoDTO.setStartDate(todo.getStartDate());
        todoDTO.setEndDate(todo.getEndDate());
        return todoDTO;
    }//toTodoDTO end

}//class end