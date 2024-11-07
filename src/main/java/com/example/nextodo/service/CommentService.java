package com.example.nextodo.service;

import com.example.nextodo.dto.CommentDTO;
import com.example.nextodo.entity.Comments;
import com.example.nextodo.entity.Todo;
import com.example.nextodo.repository.CommentRepository;
import com.example.nextodo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {
    public final CommentRepository commentRepository;
    private final TodoRepository todoRepository;

    public List<CommentDTO> getComments(Long todoId){
        log.info("CommentService.getComments & TodoID : " + todoId);
        List<Comments> comments = commentRepository.findByTodoTodoId(todoId);
        log.info("CommentService.getComments & Comments : " + comments);
        return comments.stream().map(CommentDTO::toCommentDTO).collect(Collectors.toList());
    }//getComments end

    public CommentDTO writeComment(CommentDTO commentDTO){
        log.info("CommentService.writeComment & CommentDTO : " + commentDTO);
        Todo todo = todoRepository.findById(commentDTO.getTodoId()).orElseThrow(() -> new IllegalArgumentException("Todo not Found"));
        Comments comments = Comments.toCommentsEntity(commentDTO);
        comments.setTodo(todo);
        try{
            commentRepository.save(comments);
        }catch(Exception e){
            log.error("댓글 작성에 실패했습니다." + e.getMessage());
            throw new RuntimeException("Failed to save Comment");
        }//try-catch end
        return CommentDTO.toCommentDTO(comments);
    }//writeComment

}
