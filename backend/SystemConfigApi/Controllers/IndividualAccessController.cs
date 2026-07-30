using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IndividualAccessController : ControllerBase
    {
        private readonly AppDbContext _context;

        public IndividualAccessController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IndividualAccessResponseDto>>> GetIndividualAccesses()
        {
            try
            {
                var items = await _context.IndividualAccesses
                    .Include(i => i.TargetUser)
                    .Include(i => i.OfficeCategory)
                    .Include(i => i.Office)
                    .Include(i => i.Department)
                    .Include(i => i.Designation)
                    .OrderByDescending(i => i.CreatedAt)
                    .ToListAsync();

                var response = items.Select(i => new IndividualAccessResponseDto
                {
                    Id = i.Id,
                    OfficeCategoryId = i.OfficeCategoryId,
                    OfficeCategoryName = i.OfficeCategory?.Name ?? "Unknown Category",
                    OfficeId = i.OfficeId,
                    OfficeName = i.Office?.Name ?? "Unknown Office",
                    DepartmentId = i.DepartmentId,
                    DepartmentName = i.Department?.Name ?? "Unknown Department",
                    DesignationId = i.DesignationId,
                    DesignationName = i.Designation?.Name ?? "Unknown Designation",
                    TargetUserId = i.TargetUserId,
                    TargetUserName = i.TargetUser?.FullName ?? "Unknown User",
                    DmsAccessLevel = i.DmsAccessLevel,
                    WorkflowRole = i.WorkflowRole,
                    CreatedAt = i.CreatedAt
                }).ToList();

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
                var i = await _context.IndividualAccesses
                    .Include(item => item.TargetUser)
                    .Include(item => item.OfficeCategory)
                    .Include(item => item.Office)
                    .Include(item => item.Department)
                    .Include(item => item.Designation)
                    .FirstOrDefaultAsync(item => item.Id == id);

                if (i == null)
                {
                    return NotFound(new { message = $"Individual Access record with ID {id} not found." });
                }

                var response = new IndividualAccessResponseDto
                {
                    Id = i.Id,
                    OfficeCategoryId = i.OfficeCategoryId,
                    OfficeCategoryName = i.OfficeCategory?.Name ?? "Unknown Category",
                    OfficeId = i.OfficeId,
                    OfficeName = i.Office?.Name ?? "Unknown Office",
                    DepartmentId = i.DepartmentId,
                    DepartmentName = i.Department?.Name ?? "Unknown Department",
                    DesignationId = i.DesignationId,
                    DesignationName = i.Designation?.Name ?? "Unknown Designation",
                    TargetUserId = i.TargetUserId,
                    TargetUserName = i.TargetUser?.FullName ?? "Unknown User",
                    DmsAccessLevel = i.DmsAccessLevel,
                    WorkflowRole = i.WorkflowRole,
                    CreatedAt = i.CreatedAt
                };

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
                var validUserIds = await _context.Users.Select(u => u.Id).ToListAsync();
                var validOfficeCatIds = await _context.OfficeCategories.Select(c => c.Id).ToListAsync();
                var validOfficeIds = await _context.Offices.Select(o => o.Id).ToListAsync();
                var validDeptIds = await _context.Departments.Select(d => d.Id).ToListAsync();
                var validDesigIds = await _context.Designations.Select(d => d.Id).ToListAsync();

                var targetUserId = validUserIds.Contains(dto.TargetUserId) ? dto.TargetUserId : validUserIds.FirstOrDefault(1);
                var catId = validOfficeCatIds.Contains(dto.OfficeCategoryId) ? dto.OfficeCategoryId : validOfficeCatIds.FirstOrDefault(1);
                var officeId = validOfficeIds.Contains(dto.OfficeId) ? dto.OfficeId : validOfficeIds.FirstOrDefault(1);
                var deptId = validDeptIds.Contains(dto.DepartmentId) ? dto.DepartmentId : validDeptIds.FirstOrDefault(1);
                var desigId = validDesigIds.Contains(dto.DesignationId) ? dto.DesignationId : validDesigIds.FirstOrDefault(1);

                var record = new IndividualAccess
                {
                    OfficeCategoryId = catId,
                    OfficeId = officeId,
                    DepartmentId = deptId,
                    DesignationId = desigId,
                    TargetUserId = targetUserId,
                    DmsAccessLevel = string.IsNullOrWhiteSpace(dto.DmsAccessLevel) ? "full_control" : dto.DmsAccessLevel,
                    WorkflowRole = string.IsNullOrWhiteSpace(dto.WorkflowRole) ? "reviewer" : dto.WorkflowRole,
                    CreatedAt = DateTime.UtcNow
                };

                _context.IndividualAccesses.Add(record);
                await _context.SaveChangesAsync();

                var result = await GetIndividualAccess(record.Id);
                return CreatedAtAction(nameof(GetIndividualAccess), new { id = record.Id }, result.Value);
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
                var record = await _context.IndividualAccesses.FindAsync(id);
                if (record == null)
                {
                    return NotFound(new { message = $"Individual Access record with ID {id} not found." });
                }

                _context.IndividualAccesses.Remove(record);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting individual access", details = ex.Message });
            }
        }
    }
}
