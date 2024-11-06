package com.example.nextodo.service;

import com.example.nextodo.dto.MemberDTO;
import com.example.nextodo.entity.Members;
import com.example.nextodo.entity.Users;
import com.example.nextodo.repository.MemberRepository;
import com.example.nextodo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    public final MemberRepository memberRepository;
    public final UserRepository userRepository;

    public MemberDTO addMember(MemberDTO memberDTO) {
        log.info("MemberService.addMember & memberDTO : " + memberDTO);

        Users user = userRepository.findById(memberDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Members members = Members.toMembersEntity(memberDTO);
        members.setUser(user);

        try {
           memberRepository.save(members);
        }catch (Exception e) {

        }

        return memberDTO;
    }

}