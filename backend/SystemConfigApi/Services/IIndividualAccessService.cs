using SystemConfigApi.DTOs;

namespace SystemConfigApi.Services
{
    public interface IIndividualAccessService
    {
        Task<IEnumerable<IndividualAccessResponseDto>> GetAllAccessesAsync();
        Task<IndividualAccessResponseDto?> GetAccessByIdAsync(int id);
        Task<IndividualAccessResponseDto> CreateAccessAsync(CreateIndividualAccessDto dto);
        Task<bool> DeleteAccessAsync(int id);
    }
}
