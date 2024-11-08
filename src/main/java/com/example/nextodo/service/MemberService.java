package com.example.nextodo.service;

import com.example.nextodo.dto.MemberDTO;
import com.example.nextodo.entity.Members;
import com.example.nextodo.entity.Users;
import com.example.nextodo.repository.MemberRepository;
import com.example.nextodo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    public final MemberRepository memberRepository;
    public final UserRepository userRepository;

    public MemberDTO addMember(MemberDTO memberDTO) {
        log.info("MemberService.addMember & memberDTO : " + memberDTO);
        Users user = userRepository.findById(memberDTO.getUserId()).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Members members = Members.toMembersEntity(memberDTO);
        members.setUser(user);
        try {
           memberRepository.save(members);
        }catch (Exception e) {
            log.error("Error: " + e.getMessage());
        }//try-catch end
        return memberDTO;
    }//addMember end

    public List<MemberDTO> getMembers(Long userId){
        log.info("MemberService.getMembers & userId: " + userId);
        List<Members> members = memberRepository.findByUserUserId(userId);

        // Members 엔티티를 MemberDTO로 변환하여 반환
        return members.stream()
                .map(member -> new MemberDTO(
                        member.getMemberId(),
                        member.getMemberName()
                ))
                .collect(Collectors.toList());
    }//getMembers

}//class end