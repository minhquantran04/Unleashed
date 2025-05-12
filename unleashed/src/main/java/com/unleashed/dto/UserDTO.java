package com.unleashed.dto;

import com.unleashed.entity.Rank;
import com.unleashed.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String userId;
    private String username;
    private String password;
    private String userEmail;
    private String fullName;
    private String userImage;
    private String userPhone;
    private Boolean enable;
    private Role role; // You may want to keep this as a simple String or create a RoleDTO
    private String currentPaymentMethod;
    private String userAddress;
    private OffsetDateTime userCreatedAt;
    private OffsetDateTime userUpdatedAt;
    private Rank rank;
}


