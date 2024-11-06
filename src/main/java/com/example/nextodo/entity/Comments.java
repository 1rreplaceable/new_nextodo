package com.example.nextodo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "comments")//DB에 정의한 테이블이 생성됨.
@RequiredArgsConstructor
public class Comments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long commentId;

    @Column
    private String text;

    @Column
    private String writer;

    @ManyToOne
    @JoinColumn(name = "todo_id")
    private Todo todoId;

}
