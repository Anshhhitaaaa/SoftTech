using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.Department)
                .Include(u => u.Designation)
                .ToListAsync();

            var dtos = users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                FullName = u.FullName,
                DepartmentId = u.DepartmentId,
                DepartmentName = u.Department?.Name ?? "General Dept",
                DesignationId = u.DesignationId,
                DesignationName = u.Designation?.Name ?? "Staff",
                Role = "Normal User"
            }).ToList();

            return Ok(dtos);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.FullName))
            {
                return BadRequest("Full Name is required.");
            }

            // Find or default department
            var dept = await _context.Departments
                .FirstOrDefaultAsync(d => d.Name.ToLower() == dto.DepartmentName.ToLower());
            if (dept == null)
            {
                dept = await _context.Departments.FirstOrDefaultAsync() ?? new Department { Id = 1, Name = "Information Technology" };
            }

            // Find or default designation
            var desig = await _context.Designations
                .FirstOrDefaultAsync(d => d.Name.ToLower() == dto.DesignationName.ToLower());
            if (desig == null)
            {
                desig = await _context.Designations.FirstOrDefaultAsync() ?? new Designation { Id = 1, Name = "Senior Specialist" };
            }

            var user = new User
            {
                FullName = dto.FullName.Trim(),
                DepartmentId = dept.Id,
                DesignationId = desig.Id
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // If user assigned a special role, grant IndividualAccess entry in DB
            if (!string.IsNullOrWhiteSpace(dto.Role) && dto.Role != "Normal User")
            {
                var roleLower = dto.Role.ToLower().Contains("approv") ? "approver" : "reviewer";
                var access = new IndividualAccess
                {
                    TargetUserId = user.Id,
                    OfficeCategoryId = 1,
                    OfficeId = 1,
                    DepartmentId = dept.Id,
                    DesignationId = desig.Id,
                    DmsAccessLevel = "full_control",
                    WorkflowRole = roleLower,
                    CreatedAt = DateTime.UtcNow
                };
                _context.IndividualAccesses.Add(access);
                await _context.SaveChangesAsync();
            }

            var responseDto = new UserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                DepartmentId = dept.Id,
                DepartmentName = dept.Name,
                DesignationId = desig.Id,
                DesignationName = desig.Name,
                Role = dto.Role ?? "Normal User"
            };

            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, responseDto);
        }
    }
}
