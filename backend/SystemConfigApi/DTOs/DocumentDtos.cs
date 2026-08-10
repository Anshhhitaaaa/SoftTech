using System;

namespace SystemConfigApi.DTOs
{
    public class DocumentResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string ContentHtml { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int CreatedByUserId { get; set; }
        public string CreatedByUserName { get; set; } = string.Empty;
        public int? ReviewedByUserId { get; set; }
        public string? ReviewedByUserName { get; set; }
        public int? ApprovedByUserId { get; set; }
        public string? ApprovedByUserName { get; set; }
        public string? ReviewerNotes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateDocumentDto
    {
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = "Audit & Compliance Report";
        public string ContentHtml { get; set; } = string.Empty;
        public int CreatedByUserId { get; set; } = 1;
        public bool SubmitForReview { get; set; } = false;
    }

    public class UpdateDocumentStatusDto
    {
        public string Status { get; set; } = string.Empty; // "Pending Review" | "Pending Approval" | "Approved" | "Draft" | "Returned to Author" | "Returned to Reviewer"
        public int ActionByUserId { get; set; }
        public string? ReviewerNotes { get; set; }
    }

    public class UpdateDocumentDto
    {
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = "Audit & Compliance Report";
        public string ContentHtml { get; set; } = string.Empty;
        public bool SubmitForReview { get; set; } = true;
        public int ActionByUserId { get; set; }
    }
}
