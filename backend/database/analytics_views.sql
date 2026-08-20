-- Database Analytics Layer: Dedicated views for Admin Analytics Application
-- Exposes pre-aggregated and clean dimensional data for high-performance reporting and secure natural-language query execution.

-- 1. Analytics Document View
CREATE OR REPLACE VIEW vw_admin_analytics_documents AS
SELECT
    d.id AS document_id,
    d.title,
    d.category,
    d.status,
    d.created_by_user_id,
    u.full_name AS author_name,
    dep.id AS department_id,
    dep.name AS department_name,
    des.id AS designation_id,
    des.name AS designation_name,
    d.reviewed_by_user_id,
    rev.full_name AS reviewer_name,
    d.approved_by_user_id,
    appr.full_name AS approver_name,
    d.created_at,
    d.updated_at,
    EXTRACT(YEAR FROM d.created_at)::INTEGER AS created_year,
    EXTRACT(MONTH FROM d.created_at)::INTEGER AS created_month,
    EXTRACT(WEEK FROM d.created_at)::INTEGER AS created_week,
    TO_CHAR(d.created_at, 'FMDay') AS created_day_of_week
FROM documents d
JOIN users u ON d.created_by_user_id = u.id
JOIN departments dep ON u.department_id = dep.id
JOIN designations des ON u.designation_id = des.id
LEFT JOIN users rev ON d.reviewed_by_user_id = rev.id
LEFT JOIN users appr ON d.approved_by_user_id = appr.id;

-- 2. Analytics User Activity Summary View
CREATE OR REPLACE VIEW vw_admin_analytics_user_activities AS
SELECT
    u.id AS user_id,
    u.full_name AS user_name,
    dep.name AS department_name,
    des.name AS designation_name,
    COUNT(DISTINCT d.id) AS total_documents_created,
    COUNT(DISTINCT CASE WHEN d.status = 'Approved' THEN d.id END) AS approved_documents_count,
    COUNT(DISTINCT CASE WHEN d.status LIKE 'Pending%' THEN d.id END) AS pending_documents_count,
    COUNT(DISTINCT d_rev.id) AS documents_reviewed_count,
    COUNT(DISTINCT d_appr.id) AS documents_approved_count,
    MAX(d.created_at) AS last_activity_timestamp
FROM users u
JOIN departments dep ON u.department_id = dep.id
JOIN designations des ON u.designation_id = des.id
LEFT JOIN documents d ON d.created_by_user_id = u.id
LEFT JOIN documents d_rev ON d_rev.reviewed_by_user_id = u.id
LEFT JOIN documents d_appr ON d_appr.approved_by_user_id = u.id
GROUP BY u.id, u.full_name, dep.name, des.name;
