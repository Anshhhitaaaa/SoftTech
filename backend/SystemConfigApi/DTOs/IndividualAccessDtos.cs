using System;

namespace SystemConfigApi.DTOs
{
    public class CreateIndividualAccessDto
    {
        public int OfficeCategoryId { get; set; }
        public int OfficeId { get; set; }
        public int DepartmentId { get; set; }
        public int DesignationId { get; set; }
        public int TargetUserId { get; set; }
        public string DmsAccessLevel { get; set; } = string.Empty; // 'full_control' | 'read_only'
        public string WorkflowRole { get; set; } = string.Empty;   // 'reviewer' | 'approver'
    }

    public class IndividualAccessResponseDto
    {
        public int Id { get; set; }
        public int OfficeCategoryId { get; set; }
        public string OfficeCategoryName { get; set; } = string.Empty;
        public int OfficeId { get; set; }
        public string OfficeName { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public int DesignationId { get; set; }
        public string DesignationName { get; set; } = string.Empty;
        public int TargetUserId { get; set; }
        public string TargetUserName { get; set; } = string.Empty;
        public string DmsAccessLevel { get; set; } = string.Empty;
        public string WorkflowRole { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
