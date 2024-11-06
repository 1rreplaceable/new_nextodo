package com.example.nextodo.dto;

import com.example.nextodo.entity.Members;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Setter
@NoArgsConstructor
@ToString
public class MemberDTO {
    private Long memberId;
    private String memberName;
    private Long userId;

    public static MemberDTO toMemberDTO(Members members){
        MemberDTO memberDTO = new MemberDTO();
        memberDTO.setMemberId(members.getMemberId());
        memberDTO.setMemberName(members.getMemberName());
//        memberDTO.setUserId(members.getMemberId());
        return memberDTO;
    }
}