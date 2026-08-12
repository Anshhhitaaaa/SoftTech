using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Services
{
    public class DocumentService : IDocumentService
    {
        private readonly AppDbContext _context;

        public DocumentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DocumentResponseDto>> GetDocumentsAsync(string? status)
        {
            var query = _context.Documents
                .Include(d => d.CreatedByUser)
                .Include(d => d.ReviewedByUser)
                .Include(d => d.ApprovedByUser)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(d => d.Status.ToLower() == status.ToLower());
            }

            var docs = await query.OrderByDescending(d => d.UpdatedAt).ToListAsync();
            return docs.Select(MapToResponseDto).ToList();
        }

        public async Task<DocumentResponseDto?> GetDocumentByIdAsync(int id)
        {
            var doc = await _context.Documents
                .Include(d => d.CreatedByUser)
                .Include(d => d.ReviewedByUser)
                .Include(d => d.ApprovedByUser)
                .FirstOrDefaultAsync(d => d.Id == id);

            return doc == null ? null : MapToResponseDto(doc);
        }

        public async Task<DocumentResponseDto> CreateDocumentAsync(CreateDocumentDto dto)
        {
            var doc = new Document
            {
                Title = dto.Title,
                Category = dto.Category ?? "Audit & Compliance Report",
                ContentHtml = dto.ContentHtml,
                Status = dto.SubmitForReview ? "Pending Review" : "Draft",
                CreatedByUserId = dto.CreatedByUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Documents.Add(doc);
            await _context.SaveChangesAsync();

            return (await GetDocumentByIdAsync(doc.Id))!;
        }

        public async Task<DocumentResponseDto?> UpdateDocumentContentAsync(int id, UpdateDocumentDto dto)
        {
            var doc = await _context.Documents.FindAsync(id);
            if (doc == null) return null;

            doc.Title = dto.Title;
            doc.Category = dto.Category;
            doc.ContentHtml = dto.ContentHtml;
            doc.UpdatedAt = DateTime.UtcNow;

            if (dto.SubmitForReview)
            {
                doc.Status = "Pending Review";
            }

            await _context.SaveChangesAsync();
            return await GetDocumentByIdAsync(id);
        }

        public async Task<DocumentResponseDto?> UpdateDocumentStatusAsync(int id, UpdateDocumentStatusDto dto)
        {
            var doc = await _context.Documents.FindAsync(id);
            if (doc == null) return null;

            doc.Status = dto.Status;
            doc.UpdatedAt = DateTime.UtcNow;
            if (!string.IsNullOrWhiteSpace(dto.ReviewerNotes))
            {
                doc.ReviewerNotes = dto.ReviewerNotes;
            }

            if (dto.Status == "Pending Approval")
            {
                doc.ReviewedByUserId = dto.ActionByUserId;
            }
            else if (dto.Status == "Approved")
            {
                doc.ApprovedByUserId = dto.ActionByUserId;
            }

            await _context.SaveChangesAsync();
            return await GetDocumentByIdAsync(id);
        }

        public async Task<bool> DeleteDocumentAsync(int id)
        {
            var doc = await _context.Documents.FindAsync(id);
            if (doc == null) return false;

            _context.Documents.Remove(doc);
            await _context.SaveChangesAsync();
            return true;
        }

        private static DocumentResponseDto MapToResponseDto(Document d)
        {
            return new DocumentResponseDto
            {
                Id = d.Id,
                Title = d.Title,
                Category = d.Category,
                ContentHtml = d.ContentHtml,
                Status = d.Status,
                CreatedByUserId = d.CreatedByUserId,
                CreatedByUserName = d.CreatedByUser?.FullName ?? "Author",
                ReviewedByUserId = d.ReviewedByUserId,
                ReviewedByUserName = d.ReviewedByUser?.FullName,
                ApprovedByUserId = d.ApprovedByUserId,
                ApprovedByUserName = d.ApprovedByUser?.FullName,
                ReviewerNotes = d.ReviewerNotes,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt
            };
        }
    }
}
