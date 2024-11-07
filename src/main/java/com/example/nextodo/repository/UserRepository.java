package com.example.nextodo.repository;

import com.example.nextodo.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository//지워도 됨
public interface UserRepository extends JpaRepository<Users, Long> {
    //이메일로 회원 정보 조회(select * from user where user_email=?)
    Optional<Users> findByUserEmail(String userEmail);
    //멤버의 이름으로 회원 ID 찾기
    Optional<Users> findByUserName(String UserName);
}//interface end