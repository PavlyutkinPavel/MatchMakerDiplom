package com.sporteventstournaments.exception;

public class NoTicketsLeftException extends RuntimeException{
    public NoTicketsLeftException() {
        super("NoTicketsLeftException");
    }
}
