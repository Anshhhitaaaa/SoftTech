using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Features.IndividualAccess.Commands;
using SystemConfigApi.Features.IndividualAccess.Queries;
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
        public async Task GetIndividualAccessesQuery_ReturnsSuccessResult()
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

            var handler = new GetIndividualAccessesQueryHandler(context);
            var items = await handler.Handle(new GetIndividualAccessesQuery(), CancellationToken.None);

            Assert.NotEmpty(items);
        }

        [Fact]
        public async Task CreateIndividualAccessCommand_ValidDto_SavesAccessRecord()
        {
            using var context = GetInMemoryDbContext();
            var handler = new CreateIndividualAccessCommandHandler(context);

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

            var item = await handler.Handle(new CreateIndividualAccessCommand(dto), CancellationToken.None);

            Assert.Equal("read_only", item.DmsAccessLevel);
        }

        [Fact]
        public async Task DeleteIndividualAccessCommand_ExistingId_RemovesRecord()
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

            var handler = new DeleteIndividualAccessCommandHandler(context);
            var result = await handler.Handle(new DeleteIndividualAccessCommand(record.Id), CancellationToken.None);

            Assert.True(result);
            Assert.Null(await context.IndividualAccesses.FindAsync(record.Id));
        }
    }
}
