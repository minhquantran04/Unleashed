package com.unleashed.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscountUserViewDTO {
    private String userId;
    private String username;
    private String email;
    private String fullName;
    private String userImage;
}