package com.sporteventstournaments.exception;
public class FanNotFoundException extends RuntimeException{
    public FanNotFoundException(){
        super("Fan not found");
    }
}

