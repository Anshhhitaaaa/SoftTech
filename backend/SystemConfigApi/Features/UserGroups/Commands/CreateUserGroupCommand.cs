using MediatR;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Features.UserGroups.Queries;
using SystemConfigApi.Models;

namespace SystemConfigApi.Features.UserGroups.Commands
{
    public record CreateUserGroupCommand(CreateUserGroupDto Dto) : IRequest<UserGroupResponseDto>;

    public class CreateUserGroupCommandHandler : IRequestHandler<CreateUserGroupCommand, UserGroupResponseDto>
    {
        private readonly AppDbContext _context;

        public CreateUserGroupCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserGroupResponseDto> Handle(CreateUserGroupCommand request, CancellationToken cancellationToken)
        {
            var dto = request.Dto;
            var userGroup = new UserGroup
            {
                GroupName = dto.GroupName,
                DmsAccessLevel = dto.DmsAccessLevel,
                WorkflowRole = dto.WorkflowRole,
                CreatedAt = DateTime.UtcNow
            };

            _context.UserGroups.Add(userGroup);
            await _context.SaveChangesAsync(cancellationToken);

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
                await _context.SaveChangesAsync(cancellationToken);
            }

            var createdGroup = await _context.UserGroups
                .Include(g => g.Members).ThenInclude(m => m.User)
                .Include(g => g.Members).ThenInclude(m => m.OfficeCategory)
                .Include(g => g.Members).ThenInclude(m => m.Office)
                .Include(g => g.Members).ThenInclude(m => m.Department)
                .Include(g => g.Members).ThenInclude(m => m.Designation)
                .FirstOrDefaultAsync(g => g.Id == userGroup.Id, cancellationToken);

            return GetUserGroupsQueryHandler.MapToResponseDto(createdGroup!);
        }
    }

    public record DeleteUserGroupCommand(int Id) : IRequest<bool>;

    public class DeleteUserGroupCommandHandler : IRequestHandler<DeleteUserGroupCommand, bool>
    {
        private readonly AppDbContext _context;

        public DeleteUserGroupCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteUserGroupCommand request, CancellationToken cancellationToken)
        {
            var userGroup = await _context.UserGroups.FindAsync(new object[] { request.Id }, cancellationToken);
            if (userGroup == null) return false;

            _context.UserGroups.Remove(userGroup);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
