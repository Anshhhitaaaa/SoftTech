using MediatR;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Features.IndividualAccess.Queries;
using SystemConfigApi.Models;

namespace SystemConfigApi.Features.IndividualAccess.Commands
{
    public record CreateIndividualAccessCommand(CreateIndividualAccessDto Dto) : IRequest<IndividualAccessResponseDto>;

    public class CreateIndividualAccessCommandHandler : IRequestHandler<CreateIndividualAccessCommand, IndividualAccessResponseDto>
    {
        private readonly AppDbContext _context;

        public CreateIndividualAccessCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IndividualAccessResponseDto> Handle(CreateIndividualAccessCommand request, CancellationToken cancellationToken)
        {
            var dto = request.Dto;
            var access = new SystemConfigApi.Models.IndividualAccess
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
            await _context.SaveChangesAsync(cancellationToken);

            var createdAccess = await _context.IndividualAccesses
                .Include(i => i.OfficeCategory)
                .Include(i => i.Office)
                .Include(i => i.Department)
                .Include(i => i.Designation)
                .Include(i => i.TargetUser)
                .FirstOrDefaultAsync(i => i.Id == access.Id, cancellationToken);

            return GetIndividualAccessesQueryHandler.MapToResponseDto(createdAccess!);
        }
    }

    public record DeleteIndividualAccessCommand(int Id) : IRequest<bool>;

    public class DeleteIndividualAccessCommandHandler : IRequestHandler<DeleteIndividualAccessCommand, bool>
    {
        private readonly AppDbContext _context;

        public DeleteIndividualAccessCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteIndividualAccessCommand request, CancellationToken cancellationToken)
        {
            var access = await _context.IndividualAccesses.FindAsync(new object[] { request.Id }, cancellationToken);
            if (access == null) return false;

            _context.IndividualAccesses.Remove(access);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
