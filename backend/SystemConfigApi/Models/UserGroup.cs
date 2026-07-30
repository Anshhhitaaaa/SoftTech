using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SystemConfigApi.Models
{
    [Table("user_groups")]
    public class UserGroup
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("group_name")]
        public string GroupName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        [Column("dms_access_level")]
        public string DmsAccessLevel { get; set; } = string.Empty; // 'full_control' | 'read_only'

        [Required]
        [MaxLength(50)]
        [Column("workflow_role")]
        public string WorkflowRole { get; set; } = string.Empty; // 'reviewer' | 'approver'

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();
    }
}
