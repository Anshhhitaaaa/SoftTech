using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SystemConfigApi.Models
{
    [Table("documents")]
    public class Document
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("category")]
        public string Category { get; set; } = "Audit & Compliance Report";

        [Column("content_html")]
        public string ContentHtml { get; set; } = string.Empty;

        [Required]
        [Column("status")]
        public string Status { get; set; } = "Draft"; // Draft | Pending Review | Pending Approval | Approved | Returned to Author | Returned to Reviewer

        [Column("created_by_user_id")]
        public int CreatedByUserId { get; set; }

        [ForeignKey("CreatedByUserId")]
        public virtual User? CreatedByUser { get; set; }

        [Column("reviewed_by_user_id")]
        public int? ReviewedByUserId { get; set; }

        [ForeignKey("ReviewedByUserId")]
        public virtual User? ReviewedByUser { get; set; }

        [Column("approved_by_user_id")]
        public int? ApprovedByUserId { get; set; }

        [ForeignKey("ApprovedByUserId")]
        public virtual User? ApprovedByUser { get; set; }

        [Column("reviewer_notes")]
        public string? ReviewerNotes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
