package com.unleashed.repo;

import com.unleashed.entity.Role;
import com.unleashed.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUserEmail(String userEmail);

    Optional<User> findByUserUsername(String username);

    Optional<User> findByUserUsernameAndUserPassword(String userUsername, String userPassword);

    Optional<User> findByUserGoogleId(String googleId);

    boolean existsByUserUsername(String username);

    boolean existsByUserEmail(String username);

    Optional<User> findById(String userId);

    Page<User> findByUserUsernameContainingOrUserEmailContaining(String username, String userEmail, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role.roleName IN :roles " +
            "AND (:search IS NULL OR LOWER(u.userUsername) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.userEmail) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findByRolesAndSearch(
            @Param("roles") List<Role> roles,
            @Param("search") String search,
            Pageable pageable);

    // Optional query for role filtering only (used when no search term is provided)
    @Query("SELECT u FROM User u WHERE u.role IN :roles")
    Page<User> findByRolesOnly(@Param("roles") List<Role> roles, Pageable pageable);

    boolean existsByUserPhone(String userPhone);

}
