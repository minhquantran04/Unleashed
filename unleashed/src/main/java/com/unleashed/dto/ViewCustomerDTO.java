package com.unleashed.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class ViewCustomerDTO {
    private String userId;
    private String username;
    private String email;
    private String phoneNumber;
    private String role;
    private Boolean enable;
    private Date createdAt;
    private Date updatedAt;
}
