using MediatR;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;

namespace SystemConfigApi.Features.IndividualAccess.Queries
{
    public record GetIndividualAccessesQuery : IRequest<IEnumerable<IndividualAccessResponseDto>>;

    public class GetIndividualAccessesQueryHandler : IRequestHandler<GetIndividualAccessesQuery, IEnumerable<IndividualAccessResponseDto>>
    {
        private readonly AppDbContext _context;

        public GetIndividualAccessesQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<IndividualAccessResponseDto>> Handle(GetIndividualAccessesQuery request, CancellationToken cancellationToken)
        {
            var accesses = await _context.IndividualAccesses
                .Include(i => i.OfficeCategory)
                .Include(i => i.Office)
                .Include(i => i.Department)
                .Include(i => i.Designation)
                .Include(i => i.TargetUser)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync(cancellationToken);

            return accesses.Select(MapToResponseDto).ToList();
        }

        internal static IndividualAccessResponseDto MapToResponseDto(SystemConfigApi.Models.IndividualAccess i)
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

    public record GetIndividualAccessByIdQuery(int Id) : IRequest<IndividualAccessResponseDto?>;

    public class GetIndividualAccessByIdQueryHandler : IRequestHandler<GetIndividualAccessByIdQuery, IndividualAccessResponseDto?>
    {
        private readonly AppDbContext _context;

        public GetIndividualAccessByIdQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IndividualAccessResponseDto?> Handle(GetIndividualAccessByIdQuery request, CancellationToken cancellationToken)
        {
            var access = await _context.IndividualAccesses
                .Include(i => i.OfficeCategory)
                .Include(i => i.Office)
                .Include(i => i.Department)
                .Include(i => i.Designation)
                .Include(i => i.TargetUser)
                .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);

            return access == null ? null : GetIndividualAccessesQueryHandler.MapToResponseDto(access);
        }
    }
}
