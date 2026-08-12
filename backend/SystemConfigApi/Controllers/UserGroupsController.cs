using Microsoft.AspNetCore.Mvc;
using SystemConfigApi.DTOs;
using SystemConfigApi.Services;

namespace SystemConfigApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserGroupsController : ControllerBase
    {
        private readonly IUserGroupService _groupService;

        public UserGroupsController(IUserGroupService groupService)
        {
            _groupService = groupService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserGroupResponseDto>>> GetUserGroups()
        {
            try
            {
                var response = await _groupService.GetAllGroupsAsync();
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
                var response = await _groupService.GetGroupByIdAsync(id);
                if (response == null)
                {
                    return NotFound(new { message = $"User Group with ID {id} not found." });
                }
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
                var result = await _groupService.CreateGroupAsync(dto);
                return CreatedAtAction(nameof(GetUserGroup), new { id = result.Id }, result);
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
                var deleted = await _groupService.DeleteGroupAsync(id);
                if (!deleted)
                {
                    return NotFound(new { message = $"User Group with ID {id} not found." });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting user group", details = ex.Message });
            }
        }
    }
}

