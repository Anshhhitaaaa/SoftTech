using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Services
{
    public class IndividualAccessService : IIndividualAccessService
    {
        private readonly AppDbContext _context;

        public IndividualAccessService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<IndividualAccessResponseDto>> GetAllAccessesAsync()
        {
            var accesses = await _context.IndividualAccesses
                .Include(i => i.OfficeCategory)
                .Include(i => i.Office)
                .Include(i => i.Department)
                .Include(i => i.Designation)
                .Include(i => i.TargetUser)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            return accesses.Select(MapToResponseDto).ToList();
        }

        public async Task<IndividualAccessResponseDto?> GetAccessByIdAsync(int id)
        {
            var access = await _context.IndividualAccesses
                .Include(i => i.OfficeCategory)
                .Include(i => i.Office)
                .Include(i => i.Department)
                .Include(i => i.Designation)
                .Include(i => i.TargetUser)
                .FirstOrDefaultAsync(i => i.Id == id);

            return access == null ? null : MapToResponseDto(access);
        }

        public async Task<IndividualAccessResponseDto> CreateAccessAsync(CreateIndividualAccessDto dto)
        {
            var access = new IndividualAccess
            {
                OfficeCategoryId = dto.OfficeCategoryId,
                OfficeId = dto.OfficeId,
                DepartmentId = dto.DepartmentId,
                DesignationId = dto.DesignationId,
                TargetUserId = dto.TargetUserId,
                DmsAccessLevel = dto.DmsAccessLevel,
                WorkflowRole = dto.WorkflowRole,
                CreatedAt = DateTime.UtcNow
            };

            _context.IndividualAccesses.Add(access);
            await _context.SaveChangesAsync();

            return (await GetAccessByIdAsync(access.Id))!;
        }

        public async Task<bool> DeleteAccessAsync(int id)
        {
            var access = await _context.IndividualAccesses.FindAsync(id);
            if (access == null) return false;

            _context.IndividualAccesses.Remove(access);
            await _context.SaveChangesAsync();
            return true;
        }

        private static IndividualAccessResponseDto MapToResponseDto(IndividualAccess i)
        {
            return new IndividualAccessResponseDto
            {
                Id = i.Id,
                OfficeCategoryId = i.OfficeCategoryId,
                OfficeCategoryName = i.OfficeCategory?.Name ?? "Unknown Category",
                OfficeId = i.OfficeId,
                OfficeName = i.Office?.Name ?? "Unknown Office",
                DepartmentId = i.DepartmentId,
                DepartmentName = i.Department?.Name ?? "Unknown Department",
                DesignationId = i.DesignationId,
                DesignationName = i.Designation?.Name ?? "Unknown Designation",
                TargetUserId = i.TargetUserId,
                TargetUserName = i.TargetUser?.FullName ?? "Unknown User",
                DmsAccessLevel = i.DmsAccessLevel,
                WorkflowRole = i.WorkflowRole,
                CreatedAt = i.CreatedAt
            };
        }
    }
}
