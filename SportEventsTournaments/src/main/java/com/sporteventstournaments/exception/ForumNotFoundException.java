package com.sporteventstournaments.exception;

public class ForumNotFoundException extends RuntimeException{
    public ForumNotFoundException(){
        super("Chat not found");
    }
}

