package com.example.nextodo.dto;

import com.example.nextodo.entity.Users;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor  // 이 어노테이션을 추가하면 모든 필드를 받는 생성자가 생성됩니다.
@ToString
public class UserDTO {
    private Long userId;
    private String userEmail;
    private String userPassword;
    private String userName;

    public static UserDTO toUserDTO(Users users) {
        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(users.getUserId());
        userDTO.setUserEmail(users.getUserEmail());
        userDTO.setUserPassword(users.getUserPassword());
        userDTO.setUserName(users.getUserName());
        return userDTO;
    }//toUserDTO end

}//class end