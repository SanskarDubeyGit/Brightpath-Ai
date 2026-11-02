package com.brightpathai.service;

import com.brightpathai.model.Project;
import com.brightpathai.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectPaginationService {

    private final ProjectRepository projectRepository;

    /**
     * Gets projects using cursor-based pagination for better performance at scale.
     * Cursor-based pagination uses the last seen ID as a pointer instead of OFFSET,
     * which avoids the performance degradation of OFFSET on large tables.
     *
     * @param cursor the ID of the last item from the previous page (null for first page)
     * @param pageSize number of items per page (max 100)
     * @return slice of projects with hasNext flag
     */
    public Slice<Project> getProjectsAfterCursor(UUID cursor, int pageSize) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(0, pageSize + 1,
            org.springframework.data.domain.Sort.by("createdAt").descending());

        if (cursor != null) {
            // Use createdAt + id for stable cursor ordering
            return projectRepository.findByCreatedAtLessThanOrderByCreatedAtDesc(
                projectRepository.findById(cursor).map(Project::getCreatedAt).orElse(Instant.now()),
                pageable
            );
        }
        return projectRepository.findAll(pageable);
    }

    /**
     * Gets projects for a specific client using cursor-based pagination.
     */
    public Slice<Project> getProjectsForClientAfterCursor(UUID clientId, UUID cursor, int pageSize) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(0, pageSize + 1,
            org.springframework.data.domain.Sort.by("createdAt").descending());

        Instant cursorDate = cursor != null
            ? projectRepository.findById(cursor).map(Project::getCreatedAt).orElse(Instant.now())
            : Instant.now();

        return projectRepository.findByClientIdAndCreatedAtLessThanOrderByCreatedAtDesc(
            clientId, cursorDate, pageable
        );
    }

    /**
     * Checks if there are more results after the given slice.
     */
    public boolean hasNext(Slice<?> slice) {
        return slice.hasNext();
    }
}
