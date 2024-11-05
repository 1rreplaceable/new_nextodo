package com.example.nextodo.repository;

import com.example.nextodo.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    //이메일로 회원 정보 조회(select * from user where user_email=?)
    Optional<UserEntity> findByUserEmail(String userEmail);
}
