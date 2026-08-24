package com.smarttimetable.dto;

public class LoginResponse {
    private String token;
    private String username;
    private String role;
    private String email;
    private Long userId;
    private String name;

    public LoginResponse() {}

    public LoginResponse(String token, String username, String role, String email, Long userId, String name) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.email = email;
        this.userId = userId;
        this.name = name;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
