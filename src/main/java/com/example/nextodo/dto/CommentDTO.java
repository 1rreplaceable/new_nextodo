package com.example.nextodo.dto;

import com.example.nextodo.entity.Comments;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Setter
@NoArgsConstructor
@ToString
public class CommentDTO {
    private Long commentId;
    private String text;
    private String writer;
    private Long todoId;//FK

    public static CommentDTO toCommentDTO(Comments comment) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setCommentId(comment.getCommentId());
        commentDTO.setText(comment.getText());
        commentDTO.setWriter(comment.getWriter());
        return commentDTO;
    }
}