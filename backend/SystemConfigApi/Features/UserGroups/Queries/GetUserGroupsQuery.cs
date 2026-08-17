using MediatR;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Features.UserGroups.Queries
{
    public record GetUserGroupsQuery : IRequest<IEnumerable<UserGroupResponseDto>>;

    public class GetUserGroupsQueryHandler : IRequestHandler<GetUserGroupsQuery, IEnumerable<UserGroupResponseDto>>
    {
        private readonly AppDbContext _context;

        public GetUserGroupsQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserGroupResponseDto>> Handle(GetUserGroupsQuery request, CancellationToken cancellationToken)
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
                .ToListAsync(cancellationToken);

            return groups.Select(MapToResponseDto).ToList();
        }

        internal static UserGroupResponseDto MapToResponseDto(UserGroup g)
        {
            return new UserGroupResponseDto
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
        }
    }

    public record GetUserGroupByIdQuery(int Id) : IRequest<UserGroupResponseDto?>;

    public class GetUserGroupByIdQueryHandler : IRequestHandler<GetUserGroupByIdQuery, UserGroupResponseDto?>
    {
        private readonly AppDbContext _context;

        public GetUserGroupByIdQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserGroupResponseDto?> Handle(GetUserGroupByIdQuery request, CancellationToken cancellationToken)
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
                .FirstOrDefaultAsync(group => group.Id == request.Id, cancellationToken);

            return g == null ? null : GetUserGroupsQueryHandler.MapToResponseDto(g);
        }
    }
}
