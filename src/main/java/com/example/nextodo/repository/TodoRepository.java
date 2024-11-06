package com.example.nextodo.repository;

import com.example.nextodo.entity.Todo;
import com.example.nextodo.entity.Users;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    //로그인한 사용자 Id로 사용자가 추가한 모든 할일을 가져옴.(Select title From todo where user_id = ?)
    List<Todo> findByUser(Users userId, Sort sort);
}