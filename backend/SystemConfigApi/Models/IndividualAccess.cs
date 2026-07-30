using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SystemConfigApi.Models
{
    [Table("individual_access")]
    public class IndividualAccess
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("office_category_id")]
        public int OfficeCategoryId { get; set; }

        [ForeignKey(nameof(OfficeCategoryId))]
        public OfficeCategory? OfficeCategory { get; set; }

        [Column("office_id")]
        public int OfficeId { get; set; }

        [ForeignKey(nameof(OfficeId))]
        public Office? Office { get; set; }

        [Column("department_id")]
        public int DepartmentId { get; set; }

        [ForeignKey(nameof(DepartmentId))]
        public Department? Department { get; set; }

        [Column("designation_id")]
        public int DesignationId { get; set; }

        [ForeignKey(nameof(DesignationId))]
        public Designation? Designation { get; set; }

        [Column("target_user_id")]
        public int TargetUserId { get; set; }

        [ForeignKey(nameof(TargetUserId))]
        public User? TargetUser { get; set; }

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
    }
}
