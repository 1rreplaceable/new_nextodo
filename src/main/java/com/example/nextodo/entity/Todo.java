package com.example.nextodo.entity;

import com.example.nextodo.dto.TodoDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import java.sql.Date;

@Entity
@Getter
@Setter//Setter는 안쓰는게 좋음.
@Table(name = "todo")//DB에 정의한 테이블이 생성됨.
@RequiredArgsConstructor
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long todoId;

    @Column
    private String title;

    @Column
    private String complete;

    @Column
    private Date startDate;

    @Column
    private Date endDate;

    @ManyToOne//외래키로 사용할 userId 필드
    @JoinColumn(name = "user_id")//user 테이블의 PK와 매핑될 컬럼 이름
    private Users user;

    public static Todo toTodoEntity(TodoDTO todoDTO){
        Todo todo = new Todo();
        todo.title = todoDTO.getTitle();
        todo.complete = todoDTO.getComplete();
        todo.startDate = todoDTO.getStartDate();
        todo.endDate = todoDTO.getEndDate();
        return todo;
    }//toTodoEntity end

}//class end