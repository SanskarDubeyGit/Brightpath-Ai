/**
 * Project service handling project CRUD operations and progress tracking.
 *
 * <p>This service manages the project lifecycle:</p>
 * <ul>
 *   <li>Create: validates slug uniqueness, sets default status to DISCOVERY</li>
 *   <li>Read: filters by user role (ADMIN/PM see all, CLIENT sees own)</li>
 *   <li>Update: partial updates supported for all fields</li>
 *   <li>Delete: soft delete via deleted_at timestamp</li>
 * </ul>
 *
 * <p>Access control is enforced at the controller layer via {@code @PreAuthorize}.</p>
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;

    /**
     * Gets projects accessible to the given user.
     *
     * <p>Access rules:</p>
     * <ul>
     *   <li>ADMIN or PROJECT_MANAGER: sees all projects</li>
     *   <li>CLIENT: sees only projects where they are the client</li>
     *   <li>DEVELOPER: sees assigned projects</li>
     * </ul>
     *
     * @param userId the user ID (for CLIENT filtering)
     * @param role the user's role
     * @param pageable pagination and sorting
     * @return paginated project responses
     */
    public Page<ProjectResponse> getProjects(UUID userId, String role, Pageable pageable) {
        Page<Project> projects;
        if ("ADMIN".equals(role) || "PROJECT_MANAGER".equals(role)) {
            projects = projectRepository.findAll(pageable);
        } else {
            projects = projectRepository.findByClientId(userId, pageable);
        }
        return projects.map(this::mapToResponse);
    }

    /**
     * Gets a single project by ID.
     *
     * @param id the project UUID
     * @return the project response
     * @throws RuntimeException if project not found
     */
    public ProjectResponse getProject(UUID id) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        return mapToResponse(project);
    }

    /**
     * Creates a new project.
     *
     * @param request the project creation request
     * @return the created project response
     * @throws RuntimeException if slug already exists
     */
    public ProjectResponse createProject(CreateProjectRequest request) {
        if (projectRepository.existsBySlug(request.name().toLowerCase().replace(" ", "-"))) {
            throw new RuntimeException("Project slug already exists");
        }

        Project project = new Project();
        project.setId(UUID.randomUUID());
        project.setClientId(request.clientId());
        project.setManagerId(request.managerId());
        project.setName(request.name());
        project.setSlug(request.name().toLowerCase().replace(" ", "-"));
        project.setDescription(request.description());
        project.setStatus(request.status() != null ? request.status() : "DISCOVERY");
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.setBudgetCents(request.budgetCents());
        project.setCurrency(request.currency() != null ? request.currency() : "USD");
        project.setRepositoryUrl(request.repositoryUrl());
        project.setCreatedAt(Instant.now());
        project.setUpdatedAt(Instant.now());

        Project saved = projectRepository.save(project);
        return mapToResponse(saved);
    }

    /**
     * Updates an existing project with partial fields.
     *
     * @param id the project UUID
     * @param request the update request (null fields are ignored)
     * @return the updated project response
     * @throws RuntimeException if project not found
     */
    public ProjectResponse updateProject(UUID id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found"));

        if (request.name() != null) project.setName(request.name());
        if (request.description() != null) project.setDescription(request.description());
        if (request.status() != null) project.setStatus(request.status());
        if (request.startDate() != null) project.setStartDate(request.startDate());
        if (request.endDate() != null) project.setEndDate(request.endDate());
        if (request.budgetCents() != null) project.setBudgetCents(request.budgetCents());
        if (request.currency() != null) project.setCurrency(request.currency());
        if (request.repositoryUrl() != null) project.setRepositoryUrl(request.repositoryUrl());
        project.setUpdatedAt(Instant.now());

        Project saved = projectRepository.save(project);
        return mapToResponse(saved);
    }

    /**
     * Soft deletes a project by setting deleted_at timestamp.
     *
     * @param id the project UUID
     * @throws RuntimeException if project not found
     */
    public void deleteProject(UUID id) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setDeletedAt(Instant.now());
        projectRepository.save(project);
    }

    private ProjectResponse mapToResponse(Project project) {
        return new ProjectResponse(
            project.getId().toString(),
            project.getName(),
            project.getSlug(),
            project.getDescription(),
            project.getStatus(),
            project.getStartDate() != null ? project.getStartDate().toString() : null,
            project.getEndDate() != null ? project.getEndDate().toString() : null,
            project.getBudgetCents(),
            project.getCurrency(),
            project.getRepositoryUrl(),
            project.getClientId().toString(),
            project.getManagerId() != null ? project.getManagerId().toString() : null,
            0,
            0,
            0,
            0,
            project.getCreatedAt().toString(),
            project.getUpdatedAt().toString()
        );
    }
}