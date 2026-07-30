using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SystemConfigApi.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("full_name")]
        public string FullName { get; set; } = string.Empty;

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
