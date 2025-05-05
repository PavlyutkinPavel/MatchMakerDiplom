package com.sporteventstournaments.exception;

public class CoachNotFoundException extends RuntimeException{
    public CoachNotFoundException(){
        super("Coach not found");
    }
}

