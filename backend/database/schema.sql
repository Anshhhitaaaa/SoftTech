CREATE TABLE IF NOT EXISTS office_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS offices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    office_category_id INT NOT NULL REFERENCES office_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS designations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    designation_id INT NOT NULL REFERENCES designations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_groups (
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(200) NOT NULL,
    dms_access_level VARCHAR(50) NOT NULL CHECK (dms_access_level IN ('full_control', 'read_only')),
    workflow_role VARCHAR(50) NOT NULL CHECK (workflow_role IN ('reviewer', 'approver')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS group_members (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES user_groups(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    office_category_id INT NOT NULL REFERENCES office_categories(id) ON DELETE CASCADE,
    office_id INT NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    designation_id INT NOT NULL REFERENCES designations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS individual_access (
    id SERIAL PRIMARY KEY,
    office_category_id INT NOT NULL REFERENCES office_categories(id) ON DELETE CASCADE,
    office_id INT NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    designation_id INT NOT NULL REFERENCES designations(id) ON DELETE CASCADE,
    target_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dms_access_level VARCHAR(50) NOT NULL CHECK (dms_access_level IN ('full_control', 'read_only')),
    workflow_role VARCHAR(50) NOT NULL CHECK (workflow_role IN ('reviewer', 'approver')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO office_categories (id, name) VALUES
(1, 'Corporate Office'),
(2, 'Zonal Office'),
(3, 'Regional Office'),
(4, 'Branch Office'),
(5, 'Site Office')
ON CONFLICT (id) DO NOTHING;

INSERT INTO offices (id, name, office_category_id) VALUES
(1, 'Headquarters - New Delhi', 1),
(2, 'Zone East - Kolkata', 2),
(3, 'Zone West - Mumbai', 2),
(4, 'Zone North - Chandigarh', 2),
(5, 'Zone South - Bengaluru', 2),
(6, 'Regional Hub - Pune', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO departments (id, name) VALUES
(1, 'Information Technology'),
(2, 'Human Resources'),
(3, 'Finance & Accounts'),
(4, 'Legal & Compliance'),
(5, 'Operations & Supply Chain'),
(6, 'Quality Assurance')
ON CONFLICT (id) DO NOTHING;

INSERT INTO designations (id, name) VALUES
(1, 'General Manager'),
(2, 'Senior Architect'),
(3, 'Project Lead'),
(4, 'Senior Specialist'),
(5, 'Executive Officer'),
(6, 'System Administrator')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, full_name, department_id, designation_id) VALUES
(1, 'Rahul Sharma', 1, 2),
(2, 'Priya Patel', 2, 1),
(3, 'Amit Verma', 3, 3),
(4, 'Sneha Reddy', 5, 4),
(5, 'Vikram Malhotra', 1, 6),
(6, 'Ananya Roy', 2, 5),
(7, 'Rohan Gupta', 2, 4),
(8, 'Kavita Singh', 4, 1),
(9, 'Manish Joshi', 6, 3),
(10, 'Deepika Padukone', 2, 4),
(11, 'Suresh Menon', 3, 2),
(12, 'Neha Kapoor', 1, 4)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    category VARCHAR(150) NOT NULL DEFAULT 'Audit & Compliance Report',
    content_html TEXT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Draft', 'Pending Review', 'Pending Approval', 'Approved', 'Returned to Author', 'Returned to Reviewer')),
    created_by_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_by_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    approved_by_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    reviewer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

SELECT setval('office_categories_id_seq', (SELECT MAX(id) FROM office_categories));
SELECT setval('offices_id_seq', (SELECT MAX(id) FROM offices));
SELECT setval('departments_id_seq', (SELECT MAX(id) FROM departments));
SELECT setval('designations_id_seq', (SELECT MAX(id) FROM designations));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('documents_id_seq', (SELECT COALESCE(MAX(id), 1) FROM documents));

