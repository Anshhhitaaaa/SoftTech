using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserGroupsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserGroupsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserGroupResponseDto>>> GetUserGroups()
        {
            try
            {
                var groups = await _context.UserGroups
                    .Include(g => g.Members)
                        .ThenInclude(m => m.User)
                    .Include(g => g.Members)
                        .ThenInclude(m => m.OfficeCategory)
                    .Include(g => g.Members)
                        .ThenInclude(m => m.Office)
                    .Include(g => g.Members)
                        .ThenInclude(m => m.Department)
                    .Include(g => g.Members)
                        .ThenInclude(m => m.Designation)
                    .OrderByDescending(g => g.CreatedAt)
                    .ToListAsync();

                var response = groups.Select(g => new UserGroupResponseDto
                {
                    Id = g.Id,
                    GroupName = g.GroupName,
                    DmsAccessLevel = g.DmsAccessLevel,
                    WorkflowRole = g.WorkflowRole,
                    CreatedAt = g.CreatedAt,
                    Members = g.Members.Select(m => new GroupMemberResponseDto
                    {
                        Id = m.Id,
                        UserId = m.UserId,
                        UserName = m.User?.FullName ?? "Unknown User",
                        OfficeCategoryId = m.OfficeCategoryId,
                        OfficeCategoryName = m.OfficeCategory?.Name ?? "Unknown Category",
                        OfficeId = m.OfficeId,
                        OfficeName = m.Office?.Name ?? "Unknown Office",
                        DepartmentId = m.DepartmentId,
                        DepartmentName = m.Department?.Name ?? "Unknown Department",
                        DesignationId = m.DesignationId,
                        DesignationName = m.Designation?.Name ?? "Unknown Designation"
                    }).ToList()
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching user groups", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserGroupResponseDto>> GetUserGroup(int id)
        {
            try
            {
                var g = await _context.UserGroups
                    .Include(group => group.Members)
                        .ThenInclude(m => m.User)
                    .Include(group => group.Members)
                        .ThenInclude(m => m.OfficeCategory)
                    .Include(group => group.Members)
                        .ThenInclude(m => m.Office)
                    .Include(group => group.Members)
                        .ThenInclude(m => m.Department)
                    .Include(group => group.Members)
                        .ThenInclude(m => m.Designation)
                    .FirstOrDefaultAsync(group => group.Id == id);

                if (g == null)
                {
                    return NotFound(new { message = $"User Group with ID {id} not found." });
                }

                var response = new UserGroupResponseDto
                {
                    Id = g.Id,
                    GroupName = g.GroupName,
                    DmsAccessLevel = g.DmsAccessLevel,
                    WorkflowRole = g.WorkflowRole,
                    CreatedAt = g.CreatedAt,
                    Members = g.Members.Select(m => new GroupMemberResponseDto
                    {
                        Id = m.Id,
                        UserId = m.UserId,
                        UserName = m.User?.FullName ?? "Unknown User",
                        OfficeCategoryId = m.OfficeCategoryId,
                        OfficeCategoryName = m.OfficeCategory?.Name ?? "Unknown Category",
                        OfficeId = m.OfficeId,
                        OfficeName = m.Office?.Name ?? "Unknown Office",
                        DepartmentId = m.DepartmentId,
                        DepartmentName = m.Department?.Name ?? "Unknown Department",
                        DesignationId = m.DesignationId,
                        DesignationName = m.Designation?.Name ?? "Unknown Designation"
                    }).ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching user group detail", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<UserGroupResponseDto>> CreateUserGroup([FromBody] CreateUserGroupDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.GroupName))
            {
                return BadRequest(new { message = "Group Name is required." });
            }

            try
            {
                var validUserIds = await _context.Users.Select(u => u.Id).ToListAsync();
                var validOfficeCatIds = await _context.OfficeCategories.Select(c => c.Id).ToListAsync();
                var validOfficeIds = await _context.Offices.Select(o => o.Id).ToListAsync();
                var validDeptIds = await _context.Departments.Select(d => d.Id).ToListAsync();
                var validDesigIds = await _context.Designations.Select(d => d.Id).ToListAsync();

                var defaultUserId = validUserIds.FirstOrDefault(1);
                var defaultCatId = validOfficeCatIds.FirstOrDefault(1);
                var defaultOfficeId = validOfficeIds.FirstOrDefault(1);
                var defaultDeptId = validDeptIds.FirstOrDefault(1);
                var defaultDesigId = validDesigIds.FirstOrDefault(1);

                var userGroup = new UserGroup
                {
                    GroupName = dto.GroupName,
                    DmsAccessLevel = dto.DmsAccessLevel,
                    WorkflowRole = dto.WorkflowRole,
                    CreatedAt = DateTime.UtcNow
                };

                if (dto.Members != null && dto.Members.Count > 0)
                {
                    foreach (var m in dto.Members)
                    {
                        userGroup.Members.Add(new GroupMember
                        {
                            UserId = validUserIds.Contains(m.UserId) ? m.UserId : defaultUserId,
                            OfficeCategoryId = validOfficeCatIds.Contains(m.OfficeCategoryId) ? m.OfficeCategoryId : defaultCatId,
                            OfficeId = validOfficeIds.Contains(m.OfficeId) ? m.OfficeId : defaultOfficeId,
                            DepartmentId = validDeptIds.Contains(m.DepartmentId) ? m.DepartmentId : defaultDeptId,
                            DesignationId = validDesigIds.Contains(m.DesignationId) ? m.DesignationId : defaultDesigId
                        });
                    }
                }
                else
                {
                    userGroup.Members.Add(new GroupMember
                    {
                        UserId = defaultUserId,
                        OfficeCategoryId = defaultCatId,
                        OfficeId = defaultOfficeId,
                        DepartmentId = defaultDeptId,
                        DesignationId = defaultDesigId
                    });
                }

                _context.UserGroups.Add(userGroup);
                await _context.SaveChangesAsync();

                var result = await GetUserGroup(userGroup.Id);
                return CreatedAtAction(nameof(GetUserGroup), new { id = userGroup.Id }, result.Value);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error creating user group", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserGroup(int id)
        {
            try
            {
                var group = await _context.UserGroups.FindAsync(id);
                if (group == null)
                {
                    return NotFound(new { message = $"User Group with ID {id} not found." });
                }

                _context.UserGroups.Remove(group);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting user group", details = ex.Message });
            }
        }
    }
}
