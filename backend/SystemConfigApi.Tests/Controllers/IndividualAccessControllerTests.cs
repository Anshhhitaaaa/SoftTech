using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Controllers;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;
using Xunit;

namespace SystemConfigApi.Tests.Controllers
{
    public class IndividualAccessControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var dbContext = new AppDbContext(options);
            dbContext.Database.EnsureCreated();
            return dbContext;
        }

        [Fact]
        public async Task GetIndividualAccesses_ReturnsSuccessResult()
        {
            using var context = GetInMemoryDbContext();
            context.IndividualAccesses.Add(new IndividualAccess
            {
                OfficeCategoryId = 1,
                OfficeId = 1,
                DepartmentId = 1,
                DesignationId = 1,
                TargetUserId = 1,
                DmsAccessLevel = "full_control",
                WorkflowRole = "approver"
            });
            await context.SaveChangesAsync();

            var controller = new IndividualAccessController(context);

            var result = await controller.GetIndividualAccesses();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var items = Assert.IsAssignableFrom<IEnumerable<IndividualAccessResponseDto>>(okResult.Value);
            Assert.NotEmpty(items);
        }

        [Fact]
        public async Task CreateIndividualAccess_ValidDto_SavesAccessRecord()
        {
            using var context = GetInMemoryDbContext();
            var controller = new IndividualAccessController(context);

            var dto = new CreateIndividualAccessDto
            {
                OfficeCategoryId = 1,
                OfficeId = 1,
                DepartmentId = 1,
                DesignationId = 1,
                TargetUserId = 1,
                DmsAccessLevel = "read_only",
                WorkflowRole = "reviewer"
            };

            var result = await controller.CreateIndividualAccess(dto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var item = Assert.IsType<IndividualAccessResponseDto>(createdResult.Value);
            Assert.Equal("read_only", item.DmsAccessLevel);
        }

        [Fact]
        public async Task DeleteIndividualAccess_ExistingId_RemovesRecord()
        {
            using var context = GetInMemoryDbContext();
            var record = new IndividualAccess
            {
                OfficeCategoryId = 1,
                OfficeId = 1,
                DepartmentId = 1,
                DesignationId = 1,
                TargetUserId = 1,
                DmsAccessLevel = "full_control",
                WorkflowRole = "approver"
            };
            context.IndividualAccesses.Add(record);
            await context.SaveChangesAsync();

            var controller = new IndividualAccessController(context);

            var result = await controller.DeleteIndividualAccess(record.Id);

            Assert.IsType<NoContentResult>(result);
            Assert.Null(await context.IndividualAccesses.FindAsync(record.Id));
        }
    }
}
