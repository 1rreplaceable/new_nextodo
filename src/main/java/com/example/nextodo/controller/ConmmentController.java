package com.example.nextodo.controller;

import com.example.nextodo.dto.CommentDTO;
import com.example.nextodo.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ConmmentController {

    private final CommentService commentService;

    @GetMapping("nextodo/getcomments")
    public ResponseEntity<List<CommentDTO>> getComments(@RequestParam Long todoId) {
        log.info("댓글을 가져올 Todo의 ID : " + todoId);
        try{
            List<CommentDTO> comments = commentService.getComments(todoId);
            return ResponseEntity.ok(comments);
        }catch (Exception e){
            log.info("댓글 불러오기 실패");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());//실패 시 비어있는 리스트 반환
        }//try-catch end
    }//getComments end

    @PostMapping("nextodo/writecomment")//투두에 댓글 작성하기
    public ResponseEntity<?> wtiteComment(@RequestBody CommentDTO commentDTO) {
        log.info("작성한 댓글 데이터 : " + commentDTO);
        try{
            CommentDTO Comment = commentService.writeComment(commentDTO);
            return ResponseEntity.ok(Comment);
        }catch(Exception e){
            log.info("댓글 작성 실패");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }//try-catch end
    }//writeComment end

}//class end