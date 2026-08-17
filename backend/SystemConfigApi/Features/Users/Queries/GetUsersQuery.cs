using MediatR;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Features.Users.Queries
{
    public record GetUsersQuery : IRequest<IEnumerable<UserResponseDto>>;

    public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, IEnumerable<UserResponseDto>>
    {
        private readonly AppDbContext _context;

        public GetUsersQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserResponseDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            var users = await _context.Users
                .Include(u => u.Department)
                .Include(u => u.Designation)
                .ToListAsync(cancellationToken);

            return users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                FullName = u.FullName,
                DepartmentId = u.DepartmentId,
                DepartmentName = u.Department?.Name ?? "General Dept",
                DesignationId = u.DesignationId,
                DesignationName = u.Designation?.Name ?? "Staff",
                Role = "Normal User"
            }).ToList();
        }
    }
}
