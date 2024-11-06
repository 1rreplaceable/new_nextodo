package com.example.nextodo.service;

import com.example.nextodo.dto.UserDTO;
import com.example.nextodo.entity.Users;
import com.example.nextodo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    public final UserRepository userRepository;//생성자 주입

    public void signup(UserDTO userDTO){
        //1. dto -> entity 변환(?)
        //2. repository의 save 메서드 호출(조건 : entity객체를 넘겨줘야함)
        log.info("UserService.save method = " + userDTO);
        Users users = Users.toUserEntity(userDTO);
        userRepository.save(users);
    }//save end

    public UserDTO login(UserDTO userDTO){
        /*
        1. 회원이 입력한 이메일을 DB에서 조회.
        2. DB에서 조회한 비밀번호와 사용자가 입력한 비밀번호가 일치하는지 판단
        */
        Optional<Users> byUserEmail = userRepository.findByUserEmail(userDTO.getUserEmail());
        if(byUserEmail.isPresent()){
            //조회 결과가 있다(해당 이메일을 가진 회원 정보가 있다)
            Users users = byUserEmail.get();
            if(users.getUserPassword().equals(userDTO.getUserPassword())){
                //비밀번호 일치
                //entity -> DTO 변환 후 리턴
                UserDTO goodLogin = UserDTO.toUserDTO(users);
                return goodLogin;
            }else{
                //비밀번호 불일치(로그인 실패)
                return null;
            }//if-else end
        }else{
            //조회 결과가 없다(해당 이메일을 가진 회원이 없다)
            return null;
        }
    }//login end

}//class end