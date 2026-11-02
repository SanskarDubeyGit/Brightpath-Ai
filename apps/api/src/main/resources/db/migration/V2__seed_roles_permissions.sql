-- V2__seed_roles_permissions.sql
-- Seed default roles and permissions

INSERT INTO auth.permissions (id, code, description, module) VALUES
    (gen_random_uuid(), 'user:read', 'View users', 'auth'),
    (gen_random_uuid(), 'user:write', 'Create/update users', 'auth'),
    (gen_random_uuid(), 'project:read', 'View projects', 'project'),
    (gen_random_uuid(), 'project:write', 'Create/update projects', 'project'),
    (gen_random_uuid(), 'project:delete', 'Delete projects', 'project'),
    (gen_random_uuid(), 'booking:read', 'View bookings', 'project'),
    (gen_random_uuid(), 'booking:write', 'Create/update bookings', 'project'),
    (gen_random_uuid(), 'cms:read', 'View CMS content', 'cms'),
    (gen_random_uuid(), 'cms:write', 'Create/update CMS content', 'cms');

INSERT INTO auth.roles (id, name, description) VALUES
    (gen_random_uuid(), 'ADMIN', 'Full system access'),
    (gen_random_uuid(), 'CLIENT', 'Access to own projects only'),
    (gen_random_uuid(), 'PROJECT_MANAGER', 'Manage assigned projects'),
    (gen_random_uuid(), 'DEVELOPER', 'Access to assigned tasks');

-- Assign permissions to roles
-- ADMIN gets all permissions
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r, auth.permissions p WHERE r.name = 'ADMIN';

-- CLIENT gets project:read, project:write (own), booking:read, booking:write, cms:read
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r, auth.permissions p
WHERE r.name = 'CLIENT' AND p.code IN ('project:read', 'project:write', 'booking:read', 'booking:write', 'cms:read');

-- PROJECT_MANAGER gets project:read, project:write, task:read, task:write, booking:read
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r, auth.permissions p
WHERE r.name = 'PROJECT_MANAGER' AND p.code IN ('project:read', 'project:write', 'booking:read');

-- DEVELOPER gets task:read, task:write, project:read (assigned)
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r, auth.permissions p
WHERE r.name = 'DEVELOPER' AND p.code IN ('project:read');