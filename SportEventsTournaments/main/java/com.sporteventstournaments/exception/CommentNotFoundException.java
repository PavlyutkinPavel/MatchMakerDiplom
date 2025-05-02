package com.sporteventstournaments.exception;

public class CommentNotFoundException extends RuntimeException{
    public CommentNotFoundException(){
        super("Comment not found");
    }
}
