using MediatR;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Features.Documents.Commands
{
    public record UpdateDocumentCommand(int Id, UpdateDocumentDto Dto) : IRequest<DocumentResponseDto?>;

    public class UpdateDocumentCommandHandler : IRequestHandler<UpdateDocumentCommand, DocumentResponseDto?>
    {
        private readonly AppDbContext _context;

        public UpdateDocumentCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DocumentResponseDto?> Handle(UpdateDocumentCommand request, CancellationToken cancellationToken)
        {
            var doc = await _context.Documents.FindAsync(new object[] { request.Id }, cancellationToken);
            if (doc == null) return null;

            var dto = request.Dto;
            doc.Title = dto.Title;
            doc.Category = dto.Category;
            doc.ContentHtml = dto.ContentHtml;
            doc.UpdatedAt = DateTime.UtcNow;

            if (dto.SubmitForReview)
            {
                doc.Status = "Pending Review";
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
