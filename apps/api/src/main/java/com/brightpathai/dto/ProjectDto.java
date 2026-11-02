package com.brightpathai.dto.project;

public record CreateProjectRequest(
    UUID clientId,
    UUID managerId,
    String name,
    String description,
    java.time.LocalDate startDate,
    java.time.LocalDate endDate,
    Long budgetCents,
    String currency,
    String repositoryUrl
) {}

public record ProjectResponse(
    String id,
    String name,
    String slug,
    String description,
    String status,
    String startDate,
    String endDate,
    Long budgetCents,
    String currency,
    String repositoryUrl,
    String clientId,
    String managerId,
    Integer progress,
    Integer milestoneCount,
    Integer taskCount,
    Integer completedTaskCount,
    String createdAt,
    String updatedAt
) {}

public record UpdateProjectRequest(
    String name,
    String description,
    String status,
    java.time.LocalDate startDate,
    java.time.LocalDate endDate,
    Long budgetCents,
    String currency,
    String repositoryUrl
) {}
