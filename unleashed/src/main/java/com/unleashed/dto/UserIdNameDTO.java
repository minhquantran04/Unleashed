package com.unleashed.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserIdNameDTO {
    private String userId;
    private String fullName;
}
