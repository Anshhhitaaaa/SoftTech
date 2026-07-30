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

        }
    }
}
