package com.example.nextodo.dto;

import com.example.nextodo.entity.Members;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor  // 이 어노테이션을 추가하면 모든 필드를 받는 생성자가 생성됩니다.
@ToString
public class MemberDTO {
    private Long memberId;
    private String memberName;
    private Long userId;

    public MemberDTO(Long memberId, String memberName) {
        this.memberId = memberId;
        this.memberName = memberName;
    }
}//class end