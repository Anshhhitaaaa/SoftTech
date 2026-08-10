using System;

namespace SystemConfigApi.DTOs
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public int DesignationId { get; set; }
        public string DesignationName { get; set; } = string.Empty;
        public string Role { get; set; } = "Normal User";
    }

    public class CreateUserDto
    {
        public string FullName { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = "Information Technology";
        public string DesignationName { get; set; } = "Senior Specialist";
        public string Role { get; set; } = "Normal User";
    }
}
