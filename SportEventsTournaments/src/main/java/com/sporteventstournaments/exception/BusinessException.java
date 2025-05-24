package com.sporteventstournaments.exception;

public class BusinessException extends RuntimeException{
    public BusinessException(String message){
        super(message);
    }

    public BusinessException(){
        super("Business error");
    }
}
