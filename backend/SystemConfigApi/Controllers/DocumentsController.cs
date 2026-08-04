using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DocumentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DocumentResponseDto>>> GetDocuments([FromQuery] string? status)
        {
            try
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

                var response = docs.Select(d => new DocumentResponseDto
                {
                    Id = d.Id,
                    Title = d.Title,
                    Category = d.Category,
                    ContentHtml = d.ContentHtml,
                    Status = d.Status,
                    CreatedByUserId = d.CreatedByUserId,
                    CreatedByUserName = d.CreatedByUser?.FullName ?? "Unknown User",
                    ReviewedByUserId = d.ReviewedByUserId,
                    ReviewedByUserName = d.ReviewedByUser?.FullName,
                    ApprovedByUserId = d.ApprovedByUserId,
                    ApprovedByUserName = d.ApprovedByUser?.FullName,
                    ReviewerNotes = d.ReviewerNotes,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching documents", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DocumentResponseDto>> GetDocument(int id)
        {
            try
            {
                var d = await _context.Documents
                    .Include(doc => doc.CreatedByUser)
                    .Include(doc => doc.ReviewedByUser)
                    .Include(doc => doc.ApprovedByUser)
                    .FirstOrDefaultAsync(doc => doc.Id == id);

                if (d == null)
                {
                    return NotFound(new { message = $"Document with ID {id} not found." });
                }

                var response = new DocumentResponseDto
                {
                    Id = d.Id,
                    Title = d.Title,
                    Category = d.Category,
                    ContentHtml = d.ContentHtml,
                    Status = d.Status,
                    CreatedByUserId = d.CreatedByUserId,
                    CreatedByUserName = d.CreatedByUser?.FullName ?? "Unknown User",
                    ReviewedByUserId = d.ReviewedByUserId,
                    ReviewedByUserName = d.ReviewedByUser?.FullName,
                    ApprovedByUserId = d.ApprovedByUserId,
                    ApprovedByUserName = d.ApprovedByUser?.FullName,
                    ReviewerNotes = d.ReviewerNotes,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching document", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<DocumentResponseDto>> CreateDocument([FromBody] CreateDocumentDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return BadRequest(new { message = "Document Title is required." });
            }

            try
            {
                var validUserIds = await _context.Users.Select(u => u.Id).ToListAsync();
                var authorId = validUserIds.Contains(dto.CreatedByUserId) ? dto.CreatedByUserId : validUserIds.FirstOrDefault(1);

                var doc = new Document
                {
                    Title = dto.Title,
                    Category = string.IsNullOrWhiteSpace(dto.Category) ? "Audit & Compliance Report" : dto.Category,
                    ContentHtml = dto.ContentHtml,
                    Status = dto.SubmitForReview ? "Pending Review" : "Draft",
                    CreatedByUserId = authorId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Documents.Add(doc);
                await _context.SaveChangesAsync();

                var result = await GetDocument(doc.Id);
                return CreatedAtAction(nameof(GetDocument), new { id = doc.Id }, result.Value);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error creating document", error = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult<DocumentResponseDto>> UpdateDocumentStatus(int id, [FromBody] UpdateDocumentStatusDto dto)
        {
            try
            {
                var doc = await _context.Documents.FindAsync(id);
                if (doc == null)
                {
                    return NotFound(new { message = $"Document with ID {id} not found." });
                }

                var validUserIds = await _context.Users.Select(u => u.Id).ToListAsync();
                var actionUserId = validUserIds.Contains(dto.ActionByUserId) ? dto.ActionByUserId : validUserIds.FirstOrDefault(1);

                doc.Status = dto.Status;
                doc.UpdatedAt = DateTime.UtcNow;

                if (!string.IsNullOrWhiteSpace(dto.ReviewerNotes))
                {
                    doc.ReviewerNotes = dto.ReviewerNotes;
                }

                if (dto.Status == "Pending Approval")
                {
                    doc.ReviewedByUserId = actionUserId;
                }
                else if (dto.Status == "Approved")
                {
                    doc.ApprovedByUserId = actionUserId;
                }

                await _context.SaveChangesAsync();

                var result = await GetDocument(doc.Id);
                return Ok(result.Value);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating document status", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            try
            {
                var doc = await _context.Documents.FindAsync(id);
                if (doc == null)
                {
                    return NotFound(new { message = $"Document with ID {id} not found." });
                }

                _context.Documents.Remove(doc);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting document", details = ex.Message });
            }
        }
    }
}
