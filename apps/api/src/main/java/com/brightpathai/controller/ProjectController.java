/**
 * Project controller handling project CRUD operations and progress tracking.
 *
 * <p>All endpoints require authentication. Authorization is enforced via
 * {@code @PreAuthorize} annotations checking user roles and permissions.</p>
 *
 * <p>Endpoints:</p>
 * <ul>
 *   <li>{@code GET /api/v1/projects} - List projects (paginated, filterable)</li>
 *   <li>{@code GET /api/v1/projects/{id}} - Get project details</li>
 *   <li>{@code POST /api/v1/projects} - Create a new project</li>
 *   <li>{@code PUT /api/v1/projects/{id}} - Update a project</li>
 *   <li>{@code DELETE /api/v1/projects/{id}} - Archive a project (soft delete)</li>
 *   <li>{@code GET /api/v1/projects/{id}/progress} - Get project progress summary</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    /**
     * Lists projects with pagination and optional filtering.
     *
     * <p>Access control:</p>
     * <ul>
     *   <li>ADMIN: sees all projects</li>
     *   <li>PROJECT_MANAGER: sees all projects</li>
     *   <li>CLIENT: sees only their own projects</li>
     *   <li>DEVELOPER: sees assigned projects</li>
     * </ul>
     *
     * @param pageable pagination and sorting parameters
     * @param userId optional filter by user ID
     * @param role optional filter by user role
     * @return paginated list of projects
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT', 'PROJECT_MANAGER', 'DEVELOPER')")
    public ResponseEntity<PageResponse<ProjectResponse>> getProjects(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) String role) {
        var page = projectService.getProjects(userId, role, pageable);
        return ResponseEntity.ok(new PageResponse<>(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()));
    }

    /**
     * Gets a project by its ID.
     *
     * @param id the project UUID
     * @return the project details
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT', 'PROJECT_MANAGER', 'DEVELOPER')")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }

    /**
     * Creates a new project.
     *
     * @param request the project creation request
     * @return the created project
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.ok(projectService.createProject(request));
    }

    /**
     * Updates an existing project.
     *
     * @param id the project UUID
     * @param request the project update request
     * @return the updated project
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable UUID id,
                                                          @Valid @RequestBody UpdateProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    /**
     * Archives (soft deletes) a project.
     *
     * @param id the project UUID
     * @return 204 No Content on success
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    public record PageResponse<T>(
            java.util.List<T> content,
            int number,
            int size,
            long totalElements,
            int totalPages
    ) {}
}