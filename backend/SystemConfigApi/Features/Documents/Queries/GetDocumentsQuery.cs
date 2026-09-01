using MediatR;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Features.Documents.Queries
{
    public record GetDocumentsQuery(string? Status) : IRequest<IEnumerable<DocumentResponseDto>>;

    public class GetDocumentsQueryHandler : IRequestHandler<GetDocumentsQuery, IEnumerable<DocumentResponseDto>>
    {
        private readonly AppDbContext _context;

        public GetDocumentsQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DocumentResponseDto>> Handle(GetDocumentsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Documents
                .AsNoTracking()
                .Include(d => d.CreatedByUser)
                .Include(d => d.ReviewedByUser)
                .Include(d => d.ApprovedByUser)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Status))
            {
                query = query.Where(d => d.Status.ToLower() == request.Status.ToLower());
            }

            var docs = await query.OrderByDescending(d => d.UpdatedAt).ToListAsync(cancellationToken);
            return docs.Select(MapToResponseDto).ToList();
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
