using MediatR;
using Microsoft.AspNetCore.Mvc;
using SystemConfigApi.Features.Lookups.Queries;

namespace SystemConfigApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LookupController : ControllerBase
    {
        private readonly IMediator _mediator;

        public LookupController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllLookups()
        {
            var result = await _mediator.Send(new GetAllLookupsQuery());
            return Ok(new
            {
                officeCategories = result.OfficeCategories,
                offices = result.Offices,
                departments = result.Departments,
                designations = result.Designations,
                users = result.Users
            });
        }
    }
}
