package com.example.nextodo.repository;

import com.example.nextodo.entity.Comments;
import com.example.nextodo.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comments, Long> {
    //투두 ID로 해당 투두의 댓글 가져오기
    List<Comments> findByTodoTodoId(Long todoId);
}
