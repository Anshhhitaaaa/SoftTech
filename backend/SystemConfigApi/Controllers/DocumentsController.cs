using Microsoft.AspNetCore.Mvc;
using SystemConfigApi.DTOs;
using SystemConfigApi.Services;

namespace SystemConfigApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentService _documentService;

        public DocumentsController(IDocumentService documentService)
        {
            _documentService = documentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DocumentResponseDto>>> GetDocuments([FromQuery] string? status)
        {
            try
            {
                var response = await _documentService.GetDocumentsAsync(status);
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
                var response = await _documentService.GetDocumentByIdAsync(id);
                if (response == null)
                {
                    return NotFound(new { message = $"Document with ID {id} not found." });
                }
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
                var result = await _documentService.CreateDocumentAsync(dto);
                return CreatedAtAction(nameof(GetDocument), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error creating document", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DocumentResponseDto>> UpdateDocument(int id, [FromBody] UpdateDocumentDto dto)
        {
            try
            {
                var result = await _documentService.UpdateDocumentContentAsync(id, dto);
                if (result == null)
                {
                    return NotFound(new { message = $"Document with ID {id} not found." });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating document", details = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult<DocumentResponseDto>> UpdateDocumentStatus(int id, [FromBody] UpdateDocumentStatusDto dto)
        {
            try
            {
                var result = await _documentService.UpdateDocumentStatusAsync(id, dto);
                if (result == null)
                {
                    return NotFound(new { message = $"Document with ID {id} not found." });
                }
                return Ok(result);
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
                var deleted = await _documentService.DeleteDocumentAsync(id);
                if (!deleted)
                {
                    return NotFound(new { message = $"Document with ID {id} not found." });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting document", details = ex.Message });
            }
        }
    }
}

