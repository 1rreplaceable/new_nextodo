package com.example.nextodo.entity;

import com.example.nextodo.dto.CommentDTO;
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
    private Todo todo;

    public static Comments toCommentsEntity(CommentDTO commentDTO) {
        Comments comments = new Comments();
        comments.text = commentDTO.getText();
        comments.writer = commentDTO.getWriter();
        return comments;
    }
}
