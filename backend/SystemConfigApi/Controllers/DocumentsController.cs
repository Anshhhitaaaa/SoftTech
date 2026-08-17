using MediatR;
using Microsoft.AspNetCore.Mvc;
using SystemConfigApi.DTOs;
using SystemConfigApi.Features.Documents.Commands;
using SystemConfigApi.Features.Documents.Queries;

namespace SystemConfigApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DocumentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DocumentResponseDto>>> GetDocuments([FromQuery] string? status)
        {
            try
            {
                var response = await _mediator.Send(new GetDocumentsQuery(status));
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
                var response = await _mediator.Send(new GetDocumentByIdQuery(id));
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
                var result = await _mediator.Send(new CreateDocumentCommand(dto));
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
                var result = await _mediator.Send(new UpdateDocumentCommand(id, dto));
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
                var result = await _mediator.Send(new UpdateDocumentStatusCommand(id, dto));
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
                var deleted = await _mediator.Send(new DeleteDocumentCommand(id));
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
