package com.example.nextodo.entity;

import com.example.nextodo.dto.MemberDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "members")//DB에 정의한 테이블이 생성됨.
@RequiredArgsConstructor
public class Members {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;

    @Column
    private String memberName;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    public static Members toMembersEntity(MemberDTO memberDTO){
        Members members = new Members();
        members.setMemberId(memberDTO.getMemberId());
        members.setMemberName(memberDTO.getMemberName());
        return members;
    }
}