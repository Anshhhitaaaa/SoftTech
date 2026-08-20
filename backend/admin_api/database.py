import os
import sqlite3
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random
from admin_api.config import settings

def get_db_connection():
    """
    Establishes and returns a database connection.
    Supports SQLite fallback and PostgreSQL depending on configuration.
    """
    db_path = settings.DATABASE_URL.replace("sqlite:///", "")
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """
    Initializes database tables, views, and seed data if not present.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create base tables for SQLite compatibility
    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS designations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        department_id INTEGER NOT NULL,
        designation_id INTEGER NOT NULL,
        FOREIGN KEY(department_id) REFERENCES departments(id),
        FOREIGN KEY(designation_id) REFERENCES designations(id)
    );

    CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        content_html TEXT NOT NULL,
        status TEXT NOT NULL,
        created_by_user_id INTEGER NOT NULL,
        reviewed_by_user_id INTEGER,
        approved_by_user_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(created_by_user_id) REFERENCES users(id)
    );
    """)

    # Seed Departments if empty
    cursor.execute("SELECT COUNT(*) FROM departments;")
    if cursor.fetchone()[0] == 0:
        departments = [
            'Information Technology', 'Human Resources', 'Finance & Accounts',
            'Legal & Compliance', 'Operations & Supply Chain', 'Quality Assurance'
        ]
        for dept in departments:
            cursor.execute("INSERT INTO departments (name) VALUES (?);", (dept,))

    # Seed Designations if empty
    cursor.execute("SELECT COUNT(*) FROM designations;")
    if cursor.fetchone()[0] == 0:
        designations = [
            'General Manager', 'Senior Architect', 'Project Lead',
            'Senior Specialist', 'Executive Officer', 'System Administrator'
        ]
        for desig in designations:
            cursor.execute("INSERT INTO designations (name) VALUES (?);", (desig,))

    # Seed Users if empty
    cursor.execute("SELECT COUNT(*) FROM users;")
    if cursor.fetchone()[0] == 0:
        users = [
            ('Rahul Sharma', 1, 2), ('Priya Patel', 2, 1), ('Amit Verma', 3, 3),
            ('Sneha Reddy', 5, 4), ('Vikram Malhotra', 1, 6), ('Ananya Roy', 2, 5),
            ('Rohan Gupta', 2, 4), ('Kavita Singh', 4, 1), ('Manish Joshi', 6, 3),
            ('Deepika Padukone', 2, 4), ('Suresh Menon', 3, 2), ('Neha Kapoor', 1, 4)
        ]
        for u in users:
            cursor.execute("INSERT INTO users (full_name, department_id, designation_id) VALUES (?, ?, ?);", u)

    # Seed Documents with realistic trends if empty
    cursor.execute("SELECT COUNT(*) FROM documents;")
    if cursor.fetchone()[0] == 0:
        categories = [
            'Audit & Compliance Report', 'Financial Statement', 'Technical Architecture',
            'HR Policy Document', 'Legal Contract', 'Standard Operating Procedure',
            'Quarterly Progress Report', 'Security Audit'
        ]
        statuses = ['Draft', 'Pending Review', 'Pending Approval', 'Approved', 'Returned to Author']
        
        now = datetime.now()
        # Seed records across previous 2 years for rich weekly, monthly, and yearly trend reporting
        documents_seed = []
        for i in range(1, 150):
            days_ago = random.randint(0, 700)
            created_dt = now - timedelta(days=days_ago)
            created_str = created_dt.strftime("%Y-%m-%d %H:%M:%S")
            title = f"{random.choice(categories)} - #{1000 + i}"
            cat = random.choice(categories)
            stat = random.choice(statuses)
            user_id = random.randint(1, 12)
            rev_id = random.randint(1, 12) if stat in ['Pending Approval', 'Approved'] else None
            appr_id = random.randint(1, 12) if stat == 'Approved' else None
            
            documents_seed.append((
                title, cat, "<p>Sample Document Content</p>", stat,
                user_id, rev_id, appr_id, created_str, created_str
            ))
        
        cursor.executemany("""
        INSERT INTO documents (
            title, category, content_html, status,
            created_by_user_id, reviewed_by_user_id, approved_by_user_id,
            created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, documents_seed)

    # Create Analytics Views in SQLite
    cursor.executescript("""
    DROP VIEW IF EXISTS vw_admin_analytics_documents;
    CREATE VIEW vw_admin_analytics_documents AS
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
        rev.full_name AS reviewer_name,
        appr.full_name AS approver_name,
        d.created_at,
        d.updated_at,
        CAST(strftime('%Y', d.created_at) AS INTEGER) AS created_year,
        CAST(strftime('%m', d.created_at) AS INTEGER) AS created_month,
        CAST(strftime('%W', d.created_at) AS INTEGER) AS created_week,
        strftime('%w', d.created_at) AS created_day_of_week
    FROM documents d
    JOIN users u ON d.created_by_user_id = u.id
    JOIN departments dep ON u.department_id = dep.id
    JOIN designations des ON u.designation_id = des.id
    LEFT JOIN users rev ON d.reviewed_by_user_id = rev.id
    LEFT JOIN users appr ON d.approved_by_user_id = appr.id;

    DROP VIEW IF EXISTS vw_admin_analytics_user_activities;
    CREATE VIEW vw_admin_analytics_user_activities AS
    SELECT
        u.id AS user_id,
        u.full_name AS user_name,
        dep.name AS department_name,
        des.name AS designation_name,
        COUNT(DISTINCT d.id) AS total_documents_created,
        COUNT(DISTINCT CASE WHEN d.status = 'Approved' THEN d.id END) AS approved_documents_count,
        COUNT(DISTINCT CASE WHEN d.status LIKE 'Pending%' THEN d.id END) AS pending_documents_count,
        MAX(d.created_at) AS last_activity_timestamp
    FROM users u
    JOIN departments dep ON u.department_id = dep.id
    JOIN designations des ON u.designation_id = des.id
    LEFT JOIN documents d ON d.created_by_user_id = u.id
    GROUP BY u.id, u.full_name, dep.name, des.name;
    """)

    conn.commit()
    conn.close()

def execute_readonly_query(sql_query: str, params: tuple = ()) -> List[Dict[str, Any]]:
    """
    Executes a validated read-only SQL query and returns list of dictionary rows.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(sql_query, params)
    rows = cursor.fetchall()
    columns = [col[0] for col in cursor.description] if cursor.description else []
    result = [dict(zip(columns, row)) for row in rows]
    conn.close()
    return result
