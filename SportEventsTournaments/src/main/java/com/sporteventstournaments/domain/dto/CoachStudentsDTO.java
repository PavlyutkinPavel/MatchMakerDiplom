package com.sporteventstournaments.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoachStudentsDTO {
    private Long programId;
    private String programTitle;
    private Integer totalStudents;
    private Double averageProgress;
    private List<StudentProgressDTO> students;
}
