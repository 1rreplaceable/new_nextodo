package com.example.nextodo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "members")//DB에 정의한 테이블이 생성됨.
@RequiredArgsConstructor
public class members {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int memberId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;
}