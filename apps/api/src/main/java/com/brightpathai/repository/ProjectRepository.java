package com.brightpathai.repository;

import com.brightpathai.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    @Query("SELECT p FROM Project p WHERE p.clientId = :clientId AND p.deletedAt IS NULL")
    Page<Project> findByClientId(@Param("clientId") UUID clientId, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.managerId = :managerId AND p.deletedAt IS NULL")
    Page<Project> findByManagerId(@Param("managerId") UUID managerId, Pageable pageable);

    Optional<Project> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Project> findByStatus(String status);

    /**
     * Cursor-based pagination: find projects created before the given timestamp.
     * Used for efficient pagination without OFFSET performance degradation.
     */
    @Query("SELECT p FROM Project p WHERE p.deletedAt IS NULL AND p.createdAt < :cursor ORDER BY p.createdAt DESC")
    org.springframework.data.domain.Slice<Project> findByCreatedAtLessThanOrderByCreatedAtDesc(
        @Param("cursor") Instant cursor, Pageable pageable);

    /**
     * Cursor-based pagination for client-specific projects.
     */
    @Query("SELECT p FROM Project p WHERE p.clientId = :clientId AND p.deletedAt IS NULL AND p.createdAt < :cursor ORDER BY p.createdAt DESC")
    org.springframework.data.domain.Slice<Project> findByClientIdAndCreatedAtLessThanOrderByCreatedAtDesc(
        @Param("clientId") UUID clientId,
        @Param("cursor") Instant cursor,
        Pageable pageable);
}
