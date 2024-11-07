package com.example.nextodo.controller;

import com.example.nextodo.dto.CommentDTO;
import com.example.nextodo.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ConmmentController {

    private final CommentService commentService;

//    @PostMapping("nextodo/writecomment")
//    public ResponseEntity<?> addComment(@RequestBody CommentDTO commentDTO) {
//
//    }
}
