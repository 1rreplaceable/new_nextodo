package com.example.nextodo.repository;

import com.example.nextodo.entity.Members;
import com.example.nextodo.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository//지워도 됨
public interface MemberRepository extends JpaRepository<Members, Long> {
}
