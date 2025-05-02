package com.sporteventstournaments.exception;

public class TeamNotFoundException extends RuntimeException{
    public TeamNotFoundException(){
        super("Team not found");
    }
}

