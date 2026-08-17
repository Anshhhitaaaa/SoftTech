using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Features.UserGroups.Commands;
using SystemConfigApi.Features.UserGroups.Queries;
using SystemConfigApi.Models;
using Xunit;

namespace SystemConfigApi.Tests.Controllers
{
    public class UserGroupsControllerTests
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
        public async Task GetUserGroupsQuery_ReturnsList()
        {
            using var context = GetInMemoryDbContext();
            context.UserGroups.Add(new UserGroup
            {
                GroupName = "Security Lead Policy",
                DmsAccessLevel = "full_control",
                WorkflowRole = "approver"
            });
            await context.SaveChangesAsync();

            var handler = new GetUserGroupsQueryHandler(context);
            var groups = await handler.Handle(new GetUserGroupsQuery(), CancellationToken.None);

            Assert.NotEmpty(groups);
            Assert.Contains(groups, g => g.GroupName == "Security Lead Policy");
        }

        [Fact]
        public async Task CreateUserGroupCommand_ValidDto_CreatesAndReturnsGroup()
        {
            using var context = GetInMemoryDbContext();
            var handler = new CreateUserGroupCommandHandler(context);

            var dto = new CreateUserGroupDto
            {
                GroupName = "Executive Group Policy",
                DmsAccessLevel = "full_control",
                WorkflowRole = "approver",
                Members = new List<CreateGroupMemberDto>
                {
                    new CreateGroupMemberDto
                    {
                        UserId = 1,
                        OfficeCategoryId = 1,
                        OfficeId = 1,
                        DepartmentId = 1,
                        DesignationId = 1
                    }
                }
            };

            var group = await handler.Handle(new CreateUserGroupCommand(dto), CancellationToken.None);

            Assert.Equal("Executive Group Policy", group.GroupName);
        }

        [Fact]
        public async Task DeleteUserGroupCommand_ExistingId_RemovesGroupFromDatabase()
        {
            using var context = GetInMemoryDbContext();
            var group = new UserGroup
            {
                GroupName = "Temporary Policy",
                DmsAccessLevel = "read_only",
                WorkflowRole = "reviewer"
            };
            context.UserGroups.Add(group);
            await context.SaveChangesAsync();

            var handler = new DeleteUserGroupCommandHandler(context);
            var result = await handler.Handle(new DeleteUserGroupCommand(group.Id), CancellationToken.None);

            Assert.True(result);
            Assert.Null(await context.UserGroups.FindAsync(group.Id));
        }
    }
}
