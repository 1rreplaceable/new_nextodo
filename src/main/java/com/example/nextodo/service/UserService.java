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

    public void signup(UserDTO userDTO){//회원가입
        log.info("UserService.save method = " + userDTO);
        Users users = Users.toUserEntity(userDTO);//1. dto -> entity 변환(DTO는 데이터를 담는 그릇이니까)
        userRepository.save(users);//2. repository의 save 메서드 호출(조건 : entity객체를 넘겨줘야함)
    }//save end

    public UserDTO login(UserDTO userDTO){//로그인
        //1. 회원이 입력한 이메일을 DB에서 조회.
        //2. DB에서 조회한 비밀번호와 사용자가 입력한 비밀번호가 일치하는지 판단
        Optional<Users> byUserEmail = userRepository.findByUserEmail(userDTO.getUserEmail());//Optional<Users>는 결과가 있을 수도 있고 없을 수도 있음을 나타냄. 사용자가 이메일을 입력했을 때 해당 이메일로 사용자를 조회할 수 있을지 모른다는 의미.
        if(byUserEmail.isPresent()){//조회 결과가 있다면(해당 이메일을 가진 회원 정보가 있다면)
            Users users = byUserEmail.get();//get()은 Optional 객체에 값이 존재할 때 그 값을 반환하는 메서드.
            if(users.getUserPassword().equals(userDTO.getUserPassword())){//비밀번호가 일치한다면(로그인 성공)
                UserDTO goodLogin = UserDTO.toUserDTO(users);//entity -> DTO 변환 후 리턴
                return goodLogin;
            }else{//비밀번호가 불일치한다면(로그인 실패)
                return null;
            }//if-else2 end
        }else{//조회 결과가 없다면(해당 이메일을 가진 회원이 없다면)
            return null;
        }//if-else end
    }//login end

}//class end