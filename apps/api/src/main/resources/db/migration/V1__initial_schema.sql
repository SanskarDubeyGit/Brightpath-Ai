-- V1__initial_schema.sql
-- Initial database schema for agency platform

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Auth schema
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE auth.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE auth.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    module TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email CITEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    locale TEXT NOT NULL DEFAULT 'en',
    timezone TEXT NOT NULL DEFAULT 'UTC',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE auth.user_roles (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE auth.role_permissions (
    role_id UUID NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES auth.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE auth.mfa_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('TOTP', 'WEBAUTHN')),
    name TEXT NOT NULL,
    secret_encrypted TEXT NOT NULL,
    public_key TEXT,
    sign_count BIGINT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE auth.oauth_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('GOOGLE', 'GITHUB', 'MICROSOFT')),
    provider_id TEXT NOT NULL,
    email CITEXT NOT NULL,
    access_token_encrypted TEXT,
    refresh_token_encrypted TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, provider_id)
);

CREATE TABLE auth.refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project schema
CREATE SCHEMA IF NOT EXISTS project;

CREATE TABLE project.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES auth.users(id),
    manager_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'DISCOVERY' CHECK (status IN ('DISCOVERY', 'PLANNING', 'IN_PROGRESS', 'REVIEW', 'DELIVERED', 'ARCHIVED')),
    start_date DATE,
    end_date DATE,
    budget_cents BIGINT,
    currency TEXT NOT NULL DEFAULT 'USD',
    repository_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE project.project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES project.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('OWNER', 'MANAGER', 'DEVELOPER', 'VIEWER')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (project_id, user_id)
);

CREATE TABLE project.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES project.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED')),
    due_date DATE,
    completed_at TIMESTAMPTZ,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES project.projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES project.milestones(id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reporter_id UUID NOT NULL REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'TASK' CHECK (type IN ('TASK', 'BUG', 'FEATURE', 'CHORE', 'RESEARCH')),
    status TEXT NOT NULL DEFAULT 'BACKLOG' CHECK (status IN ('BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED')),
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    story_points INTEGER,
    due_date DATE,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES project.projects(id) ON DELETE SET NULL,
    client_id UUID NOT NULL REFERENCES auth.users(id),
    slot_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW')),
    notes TEXT,
    meeting_url TEXT,
    reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project.booking_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES auth.users(id),
    title TEXT NOT NULL DEFAULT 'Consultation Call',
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    max_bookings INTEGER NOT NULL DEFAULT 1,
    current_bookings INTEGER NOT NULL DEFAULT 0,
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    recurrence_rule TEXT,
    location_type TEXT NOT NULL DEFAULT 'VIDEO' CHECK (location_type IN ('VIDEO', 'PHONE', 'IN_PERSON')),
    location_details TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CMS schema
CREATE SCHEMA IF NOT EXISTS cms;

CREATE TABLE cms.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cms.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cms.case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    client_name TEXT,
    client_logo_url TEXT,
    industry TEXT,
    technologies TEXT[],
    results TEXT,
    featured_image TEXT,
    gallery_images TEXT[],
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED')),
    published_at TIMESTAMPTZ,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cms.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    category_id UUID REFERENCES cms.categories(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED')),
    published_at TIMESTAMPTZ,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    reading_time_min INTEGER,
    view_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cms.blog_post_tags (
    post_id UUID NOT NULL REFERENCES cms.blog_posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES cms.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE cms.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    template TEXT NOT NULL DEFAULT 'default',
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    published_at TIMESTAMPTZ,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cms.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    alt_text TEXT,
    width INTEGER,
    height INTEGER,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Shared schema
CREATE SCHEMA IF NOT EXISTS shared;

CREATE TABLE shared.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT')),
    user_id UUID REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_active ON auth.users(is_active) WHERE is_active;
CREATE INDEX idx_mfa_user ON auth.mfa_devices(user_id);
CREATE INDEX idx_oauth_user ON auth.oauth_providers(user_id);
CREATE INDEX idx_oauth_provider_id ON auth.oauth_providers(provider, provider_id);
CREATE INDEX idx_refresh_user ON auth.refresh_tokens(user_id);
CREATE INDEX idx_refresh_expires ON auth.refresh_tokens(expires_at) WHERE revoked_at IS NULL;

CREATE INDEX idx_projects_client ON project.projects(client_id);
CREATE INDEX idx_projects_manager ON project.projects(manager_id);
CREATE INDEX idx_projects_status ON project.projects(status);
CREATE INDEX idx_projects_slug ON project.projects(slug);
CREATE INDEX idx_pm_project ON project.project_members(project_id);
CREATE INDEX idx_pm_user ON project.project_members(user_id);
CREATE INDEX idx_milestones_project ON project.milestones(project_id);
CREATE INDEX idx_milestones_status ON project.milestones(status);
CREATE INDEX idx_tasks_project ON project.tasks(project_id);
CREATE INDEX idx_tasks_assignee ON project.tasks(assignee_id);
CREATE INDEX idx_tasks_status ON project.tasks(status);
CREATE INDEX idx_tasks_milestone ON project.tasks(milestone_id);
CREATE INDEX idx_bookings_client ON project.bookings(client_id);
CREATE INDEX idx_bookings_project ON project.bookings(project_id);
CREATE INDEX idx_bookings_slot ON project.bookings(slot_id);
CREATE INDEX idx_bookings_status ON project.bookings(status);
CREATE INDEX idx_slots_host ON project.booking_slots(host_id);
CREATE INDEX idx_slots_time ON project.booking_slots(start_at, end_at);
CREATE INDEX idx_slots_active ON project.booking_slots(is_active) WHERE is_active;

CREATE INDEX idx_cs_status ON cms.case_studies(status);
CREATE INDEX idx_cs_slug ON cms.case_studies(slug);
CREATE INDEX idx_cs_published ON cms.case_studies(published_at) WHERE status = 'PUBLISHED';
CREATE INDEX idx_cs_technologies ON cms.case_studies USING GIN (technologies);
CREATE INDEX idx_bp_status ON cms.blog_posts(status);
CREATE INDEX idx_bp_slug ON cms.blog_posts(slug);
CREATE INDEX idx_bp_category ON cms.blog_posts(category_id);
CREATE INDEX idx_bp_published ON cms.blog_posts(published_at) WHERE status = 'PUBLISHED';
CREATE INDEX idx_bp_author ON cms.blog_posts(author_id);
CREATE INDEX idx_pages_slug ON cms.pages(slug);
CREATE INDEX idx_pages_status ON cms.pages(status);
CREATE INDEX idx_media_uploader ON cms.media(uploaded_by);

CREATE INDEX idx_audit_entity ON shared.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_user ON shared.audit_log(user_id);
CREATE INDEX idx_audit_created ON shared.audit_log(created_at DESC);