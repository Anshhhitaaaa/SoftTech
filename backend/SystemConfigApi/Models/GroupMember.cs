using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SystemConfigApi.Models
{
    [Table("group_members")]
    public class GroupMember
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("group_id")]
        public int GroupId { get; set; }

        [ForeignKey(nameof(GroupId))]
        public UserGroup? UserGroup { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

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
    }
}
