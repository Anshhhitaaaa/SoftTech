using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Models;

namespace SystemConfigApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<UserGroup> UserGroups { get; set; } = null!;
        public DbSet<GroupMember> GroupMembers { get; set; } = null!;
        public DbSet<IndividualAccess> IndividualAccesses { get; set; } = null!;
        public DbSet<OfficeCategory> OfficeCategories { get; set; } = null!;
        public DbSet<Office> Offices { get; set; } = null!;
        public DbSet<Department> Departments { get; set; } = null!;
        public DbSet<Designation> Designations { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;

        public DbSet<Document> Documents { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cascade delete behavior for UserGroup -> GroupMembers
            modelBuilder.Entity<GroupMember>()
                .HasOne(gm => gm.UserGroup)
                .WithMany(ug => ug.Members)
                .HasForeignKey(gm => gm.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            // Initial Seed Data for Lookups
            modelBuilder.Entity<OfficeCategory>().HasData(
                new OfficeCategory { Id = 1, Name = "Corporate Office" },
                new OfficeCategory { Id = 2, Name = "Zonal Office" },
                new OfficeCategory { Id = 3, Name = "Regional Office" },
                new OfficeCategory { Id = 4, Name = "Branch Office" },
                new OfficeCategory { Id = 5, Name = "Site Office" }
            );

            modelBuilder.Entity<Office>().HasData(
                new Office { Id = 1, Name = "Headquarters - New Delhi", OfficeCategoryId = 1 },
                new Office { Id = 2, Name = "Zone East - Kolkata", OfficeCategoryId = 2 },
                new Office { Id = 3, Name = "Zone West - Mumbai", OfficeCategoryId = 2 },
                new Office { Id = 4, Name = "Zone North - Chandigarh", OfficeCategoryId = 2 },
                new Office { Id = 5, Name = "Zone South - Bengaluru", OfficeCategoryId = 2 },
                new Office { Id = 6, Name = "Regional Hub - Pune", OfficeCategoryId = 3 }
            );

            modelBuilder.Entity<Department>().HasData(
                new Department { Id = 1, Name = "Information Technology" },
                new Department { Id = 2, Name = "Human Resources" },
                new Department { Id = 3, Name = "Finance & Accounts" },
                new Department { Id = 4, Name = "Legal & Compliance" },
                new Department { Id = 5, Name = "Operations & Supply Chain" },
                new Department { Id = 6, Name = "Quality Assurance" }
            );

            modelBuilder.Entity<Designation>().HasData(
                new Designation { Id = 1, Name = "General Manager" },
                new Designation { Id = 2, Name = "Senior Architect" },
                new Designation { Id = 3, Name = "Project Lead" },
                new Designation { Id = 4, Name = "Senior Specialist" },
                new Designation { Id = 5, Name = "Executive Officer" },
                new Designation { Id = 6, Name = "System Administrator" }
            );

            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, FullName = "Rahul Sharma", DepartmentId = 1, DesignationId = 2 },
                new User { Id = 2, FullName = "Priya Patel", DepartmentId = 2, DesignationId = 1 },
                new User { Id = 3, FullName = "Amit Verma", DepartmentId = 3, DesignationId = 3 },
                new User { Id = 4, FullName = "Sneha Reddy", DepartmentId = 5, DesignationId = 4 },
                new User { Id = 5, FullName = "Vikram Malhotra", DepartmentId = 1, DesignationId = 6 },
                new User { Id = 6, FullName = "Ananya Roy", DepartmentId = 2, DesignationId = 5 },
                new User { Id = 7, FullName = "Rohan Gupta", DepartmentId = 2, DesignationId = 4 },
                new User { Id = 8, FullName = "Kavita Singh", DepartmentId = 4, DesignationId = 1 },
                new User { Id = 9, FullName = "Manish Joshi", DepartmentId = 6, DesignationId = 3 },
                new User { Id = 10, FullName = "Deepika Padukone", DepartmentId = 2, DesignationId = 4 },
                new User { Id = 11, FullName = "Suresh Menon", DepartmentId = 3, DesignationId = 2 },
                new User { Id = 12, FullName = "Neha Kapoor", DepartmentId = 1, DesignationId = 4 }
            );

            modelBuilder.Entity<UserGroup>().HasData(
                new UserGroup
                {
                    Id = 1,
                    GroupName = "IT Audit & Security Group",
                    DmsAccessLevel = "full_control",
                    WorkflowRole = "reviewer",
                    CreatedAt = new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc)
                },
                new UserGroup
                {
                    Id = 2,
                    GroupName = "Legal & Risk Approvers Group",
                    DmsAccessLevel = "full_control",
                    WorkflowRole = "approver",
                    CreatedAt = new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc)
                },
                new UserGroup
                {
                    Id = 3,
                    GroupName = "HR Operations Policy Group",
                    DmsAccessLevel = "read_only",
                    WorkflowRole = "normal_user",
                    CreatedAt = new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            modelBuilder.Entity<GroupMember>().HasData(
                new GroupMember { Id = 1, GroupId = 1, UserId = 1 },
                new GroupMember { Id = 2, GroupId = 1, UserId = 2 },
                new GroupMember { Id = 3, GroupId = 1, UserId = 5 },
                new GroupMember { Id = 4, GroupId = 2, UserId = 8 },
                new GroupMember { Id = 5, GroupId = 2, UserId = 3 },
                new GroupMember { Id = 6, GroupId = 3, UserId = 6 },
                new GroupMember { Id = 7, GroupId = 3, UserId = 7 }
            );

            modelBuilder.Entity<IndividualAccess>().HasData(
                new IndividualAccess
                {
                    Id = 1,
                    OfficeCategoryId = 1,
                    OfficeId = 1,
                    DepartmentId = 1,
                    DesignationId = 2,
                    TargetUserId = 2,
                    DmsAccessLevel = "full_control",
                    WorkflowRole = "reviewer",
                    CreatedAt = new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc)
                },
                new IndividualAccess
                {
                    Id = 2,
                    OfficeCategoryId = 1,
                    OfficeId = 1,
                    DepartmentId = 4,
                    DesignationId = 1,
                    TargetUserId = 8,
                    DmsAccessLevel = "full_control",
                    WorkflowRole = "approver",
                    CreatedAt = new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            modelBuilder.Entity<Document>().HasData(
                new Document
                {
                    Id = 1,
                    Title = "Q3 Enterprise Information Security & Access Policy Audit",
                    Category = "Audit & Compliance",
                    ContentHtml = "<h1>Enterprise Information Security Audit</h1><p>Comprehensive review of group policies and individual access assignments across regional offices.</p><table><tr><th>Metric</th><th>Status</th></tr><tr><td>MFA Compliance</td><td>99.4%</td></tr><tr><td>DMS Access Control</td><td>Verified</td></tr></table>",
                    Status = "Approved",
                    CreatedByUserId = 1,
                    ReviewedByUserId = 2,
                    ApprovedByUserId = 8,
                    ReviewerNotes = "Verified against Q3 compliance matrix. All criteria satisfied.",
                    CreatedAt = new DateTime(2026, 7, 28, 10, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2026, 7, 30, 15, 30, 0, DateTimeKind.Utc)
                }
            );

        }
    }
}
