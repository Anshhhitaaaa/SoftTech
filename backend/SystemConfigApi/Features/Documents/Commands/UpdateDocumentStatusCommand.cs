using MediatR;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Features.Documents.Commands
{
    public record UpdateDocumentStatusCommand(int Id, UpdateDocumentStatusDto Dto) : IRequest<DocumentResponseDto?>;

    public class UpdateDocumentStatusCommandHandler : IRequestHandler<UpdateDocumentStatusCommand, DocumentResponseDto?>
    {
        private readonly AppDbContext _context;

        public UpdateDocumentStatusCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DocumentResponseDto?> Handle(UpdateDocumentStatusCommand request, CancellationToken cancellationToken)
        {
            var doc = await _context.Documents.FindAsync(new object[] { request.Id }, cancellationToken);
            if (doc == null) return null;

            var dto = request.Dto;
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

            await _context.SaveChangesAsync(cancellationToken);

            var updatedDoc = await _context.Documents
                .Include(d => d.CreatedByUser)
                .Include(d => d.ReviewedByUser)
                .Include(d => d.ApprovedByUser)
                .FirstOrDefaultAsync(d => d.Id == doc.Id, cancellationToken);

            return updatedDoc == null ? null : MapToResponseDto(updatedDoc);
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
