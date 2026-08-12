using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Services
{
    public class UserGroupService : IUserGroupService
    {
        private readonly AppDbContext _context;

        public UserGroupService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserGroupResponseDto>> GetAllGroupsAsync()
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

            return groups.Select(MapToResponseDto).ToList();
        }

        public async Task<UserGroupResponseDto?> GetGroupByIdAsync(int id)
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

            return g == null ? null : MapToResponseDto(g);
        }

        public async Task<UserGroupResponseDto> CreateGroupAsync(CreateUserGroupDto dto)
        {
            var userGroup = new UserGroup
            {
                GroupName = dto.GroupName,
                DmsAccessLevel = dto.DmsAccessLevel,
                WorkflowRole = dto.WorkflowRole,
                CreatedAt = DateTime.UtcNow
            };

            _context.UserGroups.Add(userGroup);
            await _context.SaveChangesAsync();

            if (dto.Members != null && dto.Members.Any())
            {
                foreach (var memberDto in dto.Members)
                {
                    var member = new GroupMember
                    {
                        GroupId = userGroup.Id,
                        UserId = memberDto.UserId,
                        OfficeCategoryId = memberDto.OfficeCategoryId,
                        OfficeId = memberDto.OfficeId,
                        DepartmentId = memberDto.DepartmentId,
                        DesignationId = memberDto.DesignationId
                    };
                    _context.GroupMembers.Add(member);
                }
                await _context.SaveChangesAsync();
            }

            var createdGroup = await GetGroupByIdAsync(userGroup.Id);
            return createdGroup!;
        }

        public async Task<bool> DeleteGroupAsync(int id)
        {
            var userGroup = await _context.UserGroups.FindAsync(id);
            if (userGroup == null) return false;

            _context.UserGroups.Remove(userGroup);
            await _context.SaveChangesAsync();
            return true;
        }

        private static UserGroupResponseDto MapToResponseDto(UserGroup g)
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
}
