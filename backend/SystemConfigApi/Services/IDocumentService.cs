using SystemConfigApi.DTOs;

namespace SystemConfigApi.Services
{
    public interface IDocumentService
    {
        Task<IEnumerable<DocumentResponseDto>> GetDocumentsAsync(string? status);
        Task<DocumentResponseDto?> GetDocumentByIdAsync(int id);
        Task<DocumentResponseDto> CreateDocumentAsync(CreateDocumentDto dto);
        Task<DocumentResponseDto?> UpdateDocumentContentAsync(int id, UpdateDocumentDto dto);
        Task<DocumentResponseDto?> UpdateDocumentStatusAsync(int id, UpdateDocumentStatusDto dto);
        Task<bool> DeleteDocumentAsync(int id);
    }
}
