using MediatR;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Features.Documents.Queries
{
    public record GetDocumentByIdQuery(int Id) : IRequest<DocumentResponseDto?>;

    public class GetDocumentByIdQueryHandler : IRequestHandler<GetDocumentByIdQuery, DocumentResponseDto?>
    {
        private readonly AppDbContext _context;

        public GetDocumentByIdQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DocumentResponseDto?> Handle(GetDocumentByIdQuery request, CancellationToken cancellationToken)
        {
            var doc = await _context.Documents
                .Include(d => d.CreatedByUser)
                .Include(d => d.ReviewedByUser)
                .Include(d => d.ApprovedByUser)
                .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

            return doc == null ? null : MapToResponseDto(doc);
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
