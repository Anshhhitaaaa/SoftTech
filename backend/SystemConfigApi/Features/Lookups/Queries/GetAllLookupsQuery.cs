using MediatR;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.Models;

namespace SystemConfigApi.Features.Lookups.Queries
{
    public class LookupsResultDto
    {
        public IEnumerable<OfficeCategory> OfficeCategories { get; set; } = new List<OfficeCategory>();
        public IEnumerable<Office> Offices { get; set; } = new List<Office>();
        public IEnumerable<Department> Departments { get; set; } = new List<Department>();
        public IEnumerable<Designation> Designations { get; set; } = new List<Designation>();
        public IEnumerable<User> Users { get; set; } = new List<User>();
    }

    public record GetAllLookupsQuery : IRequest<LookupsResultDto>;

    public class GetAllLookupsQueryHandler : IRequestHandler<GetAllLookupsQuery, LookupsResultDto>
    {
        private readonly AppDbContext _context;

        public GetAllLookupsQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<LookupsResultDto> Handle(GetAllLookupsQuery request, CancellationToken cancellationToken)
        {
            var categories = await _context.OfficeCategories.AsNoTracking().ToListAsync(cancellationToken);
            var offices = await _context.Offices.AsNoTracking().ToListAsync(cancellationToken);
            var departments = await _context.Departments.AsNoTracking().ToListAsync(cancellationToken);
            var designations = await _context.Designations.AsNoTracking().ToListAsync(cancellationToken);
            var users = await _context.Users.AsNoTracking().ToListAsync(cancellationToken);

            return new LookupsResultDto
            {
                OfficeCategories = categories,
                Offices = offices,
                Departments = departments,
                Designations = designations,
                Users = users
            };
        }
    }
}
