using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SystemConfigApi.Models
{
    [Table("offices")]
    public class Office
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("office_category_id")]
        public int OfficeCategoryId { get; set; }

        [ForeignKey(nameof(OfficeCategoryId))]
        public OfficeCategory? OfficeCategory { get; set; }
    }
}
