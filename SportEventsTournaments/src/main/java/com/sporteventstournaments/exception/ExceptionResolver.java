package com.sporteventstournaments.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;

@ControllerAdvice
@Slf4j
public class ExceptionResolver {
    @ExceptionHandler(value = UserNotFoundException.class)
    ResponseEntity<HttpStatus> userNotFoundException(){
        log.info("UserNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = NoTicketsLeftException.class)
    ResponseEntity<HttpStatus> noTicketsLeftException(){
        log.info("NoTicketsLeft exception!!!");
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(value = ChatNotFoundException.class)
    ResponseEntity<HttpStatus> chatNotFoundException(){
        log.info("ChatNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = MessageNotFoundException.class)
    ResponseEntity<HttpStatus> messageNotFoundException(){
        log.info("MessageNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = CoachNotFoundException.class)
    ResponseEntity<HttpStatus> coachNotFoundException(){
        log.info("CoachNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = PostNotFoundException.class)
    ResponseEntity<HttpStatus> postNotFoundException(){
        log.info("PostNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = CommentNotFoundException.class)
    ResponseEntity<HttpStatus> commentNotFoundException(){
        log.info("CommentNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = FanNotFoundException.class)
    ResponseEntity<HttpStatus> FanNotFoundException(){
        log.info("FanNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = TeamNotFoundException.class)
    ResponseEntity<HttpStatus> TeamNotFoundException(){
        log.info("TeamNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = ForumNotFoundException.class)
    ResponseEntity<HttpStatus> ForumNotFoundException(){
        log.info("ForumNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = LPlayerCoachNotFoundException.class)
    ResponseEntity<HttpStatus> LPlayerCoachNotFoundException(){
        log.info("LPlayerCoachNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = MatchScheduleNotFoundException.class)
    ResponseEntity<HttpStatus> MatchScheduleNotFoundException(){
        log.info("MatchScheduleNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = MatchResultNotFoundException.class)
    ResponseEntity<HttpStatus> MatchResultNotFoundException(){
        log.info("MatchResultNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = EventNotFoundException.class)
    ResponseEntity<HttpStatus> EventNotFoundException(){
        log.info("EventNotFoundException exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = ForbiddenOperationException.class)
    ResponseEntity<HttpStatus> ForbiddenOperationException(){
        log.info("ForbiddenOperationException exception!!!");
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = InvalidOperationException.class)
    ResponseEntity<HttpStatus> InvalidOperationException(){
        log.info("InvalidOperationException exception!!!");
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = NewsNotFoundException.class)
    ResponseEntity<HttpStatus> NewsNotFoundException(){
        log.info("NewsNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = BusinessException.class)
    ResponseEntity<HttpStatus> BusinessException(){
        log.info("BusinessException exception!!!");
        return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
    }

    @ExceptionHandler(value = ResourceNotFoundException.class)
    ResponseEntity<HttpStatus> ResourceNotFoundException(){
        log.info("ResourceNotFoundException exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = PlayerNotFoundException.class)
    ResponseEntity<HttpStatus> PlayerNotFoundException(){
        log.info("PlayerNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = ShopNotFoundException.class)
    ResponseEntity<HttpStatus> ShopNotFoundException(){
        log.info("ShopNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = StadiumNotFoundException.class)
    ResponseEntity<HttpStatus> StadiumNotFoundException(){
        log.info("StadiumNotFound exception!!!");
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = IllegalArgumentException.class)
    ResponseEntity<HttpStatus> illegalArgumentException(){
        log.info("IllegalArgument exception!!!");
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = OptimisticLockingFailureException.class)
    ResponseEntity<HttpStatus> optimisticLockingFailureException(){
        log.info("OptimisticLockingFailure exception!!!");
        return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value = IOException.class)
    ResponseEntity<HttpStatus> IOException(){
        log.info("IO exception!!!, failed to update profile image");
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
