using MediatR;
using Microsoft.AspNetCore.Mvc;
using SystemConfigApi.DTOs;
using SystemConfigApi.Features.Users.Commands;
using SystemConfigApi.Features.Users.Queries;

namespace SystemConfigApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UsersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var dtos = await _mediator.Send(new GetUsersQuery());
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.FullName))
            {
                return BadRequest("Full Name is required.");
            }

            var responseDto = await _mediator.Send(new CreateUserCommand(dto));
            return CreatedAtAction(nameof(GetUsers), new { id = responseDto.Id }, responseDto);
        }
    }
}
