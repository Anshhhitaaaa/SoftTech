using Microsoft.AspNetCore.Mvc;
using SystemConfigApi.DTOs;
using SystemConfigApi.Services;

namespace SystemConfigApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IndividualAccessController : ControllerBase
    {
        private readonly IIndividualAccessService _accessService;

        public IndividualAccessController(IIndividualAccessService accessService)
        {
            _accessService = accessService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IndividualAccessResponseDto>>> GetIndividualAccesses()
        {
            try
            {
                var response = await _accessService.GetAllAccessesAsync();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching individual access records", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IndividualAccessResponseDto>> GetIndividualAccess(int id)
        {
            try
            {
                var response = await _accessService.GetAccessByIdAsync(id);
                if (response == null)
                {
                    return NotFound(new { message = $"Individual Access record with ID {id} not found." });
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching individual access detail", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<IndividualAccessResponseDto>> CreateIndividualAccess([FromBody] CreateIndividualAccessDto dto)
        {
            try
            {
                var result = await _accessService.CreateAccessAsync(dto);
                return CreatedAtAction(nameof(GetIndividualAccess), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error saving individual access", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIndividualAccess(int id)
        {
            try
            {
                var deleted = await _accessService.DeleteAccessAsync(id);
                if (!deleted)
                {
                    return NotFound(new { message = $"Individual Access record with ID {id} not found." });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting individual access", details = ex.Message });
            }
        }
    }
}

