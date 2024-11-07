package com.example.nextodo.repository;

import com.example.nextodo.dto.MemberDTO;
import com.example.nextodo.entity.Members;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository//지워도 됨
public interface MemberRepository extends JpaRepository<Members, Long> {
    //
    List<Members> findByUserUserId(Long userId);//현재 사용자의 모든 친구 목록 가져오기
}
