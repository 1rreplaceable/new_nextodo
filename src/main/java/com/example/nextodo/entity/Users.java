package com.example.nextodo.entity;

import com.example.nextodo.dto.UserDTO;
import jakarta.persistence.*;//javax말고 jakarta사용해야함.
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Entity
@Setter
@Getter
@Table(name = "user")//DB에 정의한 테이블이 생성됨.
public class Users {//테이블 생성.
    @Id//pk지정
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto_Increment
    private Long userId;

    @Column(unique = true)//unique 제약조건 추가
    private String userEmail;

    @Column
    private String userPassword;

    @Column
    private String userName;
    
    public static Users toUserEntity(UserDTO userDTO){
        Users users = new Users();
        users.userEmail = userDTO.getUserEmail();
        users.userPassword = userDTO.getUserPassword();
        users.userName = userDTO.getUserName();
        return users;
    }
}
