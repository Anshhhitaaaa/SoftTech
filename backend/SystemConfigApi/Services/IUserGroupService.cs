using SystemConfigApi.DTOs;

namespace SystemConfigApi.Services
{
    public interface IUserGroupService
    {
        Task<IEnumerable<UserGroupResponseDto>> GetAllGroupsAsync();
        Task<UserGroupResponseDto?> GetGroupByIdAsync(int id);
        Task<UserGroupResponseDto> CreateGroupAsync(CreateUserGroupDto dto);
        Task<bool> DeleteGroupAsync(int id);
    }
}
