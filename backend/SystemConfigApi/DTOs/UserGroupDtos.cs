using System;
using System.Collections.Generic;

namespace SystemConfigApi.DTOs
{
    public class CreateGroupMemberDto
    {
        public int UserId { get; set; }
        public int OfficeCategoryId { get; set; }
        public int OfficeId { get; set; }
        public int DepartmentId { get; set; }
        public int DesignationId { get; set; }
    }

    public class CreateUserGroupDto
    {
        public string GroupName { get; set; } = string.Empty;
        public string DmsAccessLevel { get; set; } = string.Empty; // 'full_control' | 'read_only'
        public string WorkflowRole { get; set; } = string.Empty;   // 'reviewer' | 'approver'
        public List<CreateGroupMemberDto> Members { get; set; } = new List<CreateGroupMemberDto>();
    }

    public class GroupMemberResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int OfficeCategoryId { get; set; }
        public string OfficeCategoryName { get; set; } = string.Empty;
        public int OfficeId { get; set; }
        public string OfficeName { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public int DesignationId { get; set; }
        public string DesignationName { get; set; } = string.Empty;
    }

    public class UserGroupResponseDto
    {
        public int Id { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public string DmsAccessLevel { get; set; } = string.Empty;
        public string WorkflowRole { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<GroupMemberResponseDto> Members { get; set; } = new List<GroupMemberResponseDto>();
    }
}
