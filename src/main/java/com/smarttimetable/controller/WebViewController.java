package com.smarttimetable.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebViewController {

    @GetMapping("/")
    public String index() {
        return "redirect:/login.html";
    }

    @GetMapping("/login")
    public String login() {
        return "forward:/login.html";
    }

    @GetMapping("/admin")
    public String adminDashboard() {
        return "forward:/admin-dashboard.html";
    }

    @GetMapping("/faculty")
    public String facultyDashboard() {
        return "forward:/faculty-dashboard.html";
    }

    @GetMapping("/student")
    public String studentDashboard() {
        return "forward:/student-dashboard.html";
    }
}
