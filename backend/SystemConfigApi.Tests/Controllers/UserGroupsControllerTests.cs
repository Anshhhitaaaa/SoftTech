using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Controllers;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
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
        public async Task GetUserGroups_ReturnsSuccessStatusCodeAndList()
        {
            using var context = GetInMemoryDbContext();
            context.UserGroups.Add(new UserGroup
            {
                GroupName = "Security Lead Policy",
                DmsAccessLevel = "full_control",
                WorkflowRole = "approver"
            });
            await context.SaveChangesAsync();

            var controller = new UserGroupsController(context);

            var result = await controller.GetUserGroups();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var groups = Assert.IsAssignableFrom<IEnumerable<UserGroupResponseDto>>(okResult.Value);
            Assert.NotEmpty(groups);
        }

        [Fact]
        public async Task CreateUserGroup_ValidDto_CreatesAndReturnsGroup()
        {
            using var context = GetInMemoryDbContext();
            var controller = new UserGroupsController(context);

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

            var result = await controller.CreateUserGroup(dto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var group = Assert.IsType<UserGroupResponseDto>(createdResult.Value);
            Assert.Equal("Executive Group Policy", group.GroupName);
        }

        [Fact]
        public async Task DeleteUserGroup_ExistingId_RemovesGroupFromDatabase()
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

            var controller = new UserGroupsController(context);

            var result = await controller.DeleteUserGroup(group.Id);

            Assert.IsType<NoContentResult>(result);
            Assert.Null(await context.UserGroups.FindAsync(group.Id));
        }
    }
}
