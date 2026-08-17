using MediatR;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Features.Users.Commands
{
    public record CreateUserCommand(CreateUserDto Dto) : IRequest<UserResponseDto>;

    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, UserResponseDto>
    {
        private readonly AppDbContext _context;

        public CreateUserCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserResponseDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var dto = request.Dto;

            // Find or default department
            var dept = await _context.Departments
                .FirstOrDefaultAsync(d => d.Name.ToLower() == dto.DepartmentName.ToLower(), cancellationToken);
            if (dept == null)
            {
                dept = await _context.Departments.FirstOrDefaultAsync(cancellationToken) ?? new Department { Id = 1, Name = "Information Technology" };
            }

            // Find or default designation
            var desig = await _context.Designations
                .FirstOrDefaultAsync(d => d.Name.ToLower() == dto.DesignationName.ToLower(), cancellationToken);
            if (desig == null)
            {
                desig = await _context.Designations.FirstOrDefaultAsync(cancellationToken) ?? new Designation { Id = 1, Name = "Senior Specialist" };
            }

            var user = new User
            {
                FullName = dto.FullName.Trim(),
                DepartmentId = dept.Id,
                DesignationId = desig.Id
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);

            // If user assigned a special role, grant IndividualAccess entry in DB
            if (!string.IsNullOrWhiteSpace(dto.Role) && dto.Role != "Normal User")
            {
                var roleLower = dto.Role.ToLower().Contains("approv") ? "approver" : "reviewer";
                var access = new SystemConfigApi.Models.IndividualAccess
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
                await _context.SaveChangesAsync(cancellationToken);
            }

            return new UserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                DepartmentId = dept.Id,
                DepartmentName = dept.Name,
                DesignationId = desig.Id,
                DesignationName = desig.Name,
                Role = dto.Role ?? "Normal User"
            };
        }
    }
}
