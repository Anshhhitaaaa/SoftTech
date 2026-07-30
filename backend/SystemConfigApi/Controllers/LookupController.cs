using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;

namespace SystemConfigApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LookupController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LookupController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllLookups()
        {
            var categories = await _context.OfficeCategories.ToListAsync();
            var offices = await _context.Offices.ToListAsync();
            var departments = await _context.Departments.ToListAsync();
            var designations = await _context.Designations.ToListAsync();
            var users = await _context.Users.ToListAsync();

            return Ok(new
            {
                officeCategories = categories,
                offices = offices,
                departments = departments,
                designations = designations,
                users = users
            });
        }
    }
}
