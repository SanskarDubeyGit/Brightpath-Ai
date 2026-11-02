package com.brightpathai.integration;

import com.brightpathai.dto.project.CreateProjectRequest;
import com.brightpathai.dto.project.ProjectResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class ProjectControllerIntegrationTest extends AbstractIntegrationTest {

    @Test
    void createProject_shouldReturnProjectResponse() {
        UUID clientId = UUID.randomUUID();
        CreateProjectRequest request = new CreateProjectRequest(
            clientId,
            null,
            "Test E-commerce Project",
            "Building an online store",
            LocalDate.of(2026, 1, 15),
            LocalDate.of(2026, 6, 30),
            500000L,
            "USD",
            "https://github.com/test/project"
        );

        ResponseEntity<ProjectResponse> response = restTemplate.postForEntity(
            "/api/v1/projects", request, ProjectResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().name()).isEqualTo("Test E-commerce Project");
        assertThat(response.getBody().status()).isEqualTo("DISCOVERY");
        assertThat(response.getBody().clientId()).isEqualTo(clientId.toString());
    }

    @Test
    void getProject_shouldReturnProject() {
        // First create a project
        UUID clientId = UUID.randomUUID();
        CreateProjectRequest request = new CreateProjectRequest(
            clientId,
            null,
            "Another Project",
            "Another description",
            null,
            null,
            null,
            "USD",
            null
        );
        ResponseEntity<ProjectResponse> createResponse = restTemplate.postForEntity(
            "/api/v1/projects", request, ProjectResponse.class
        );
        String projectId = createResponse.getBody().id();

        // Then get it
        ResponseEntity<ProjectResponse> response = restTemplate.getForEntity(
            "/api/v1/projects/" + projectId, ProjectResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().id()).isEqualTo(projectId);
    }
}
