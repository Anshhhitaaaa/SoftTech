using MediatR;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Features.Documents.Commands
{
    public record CreateDocumentCommand(CreateDocumentDto Dto) : IRequest<DocumentResponseDto>;

    public class CreateDocumentCommandHandler : IRequestHandler<CreateDocumentCommand, DocumentResponseDto>
    {
        private readonly AppDbContext _context;

        public CreateDocumentCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DocumentResponseDto> Handle(CreateDocumentCommand request, CancellationToken cancellationToken)
        {
            var dto = request.Dto;
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
            await _context.SaveChangesAsync(cancellationToken);

            var createdDoc = await _context.Documents
                .Include(d => d.CreatedByUser)
                .Include(d => d.ReviewedByUser)
                .Include(d => d.ApprovedByUser)
                .FirstOrDefaultAsync(d => d.Id == doc.Id, cancellationToken);

            return MapToResponseDto(createdDoc!);
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
