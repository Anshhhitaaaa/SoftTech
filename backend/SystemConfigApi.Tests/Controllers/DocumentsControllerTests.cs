using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Controllers;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Models;
using Xunit;

namespace SystemConfigApi.Tests.Controllers
{
    public class DocumentsControllerTests
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
        public async Task GetDocuments_ReturnsSuccessResult()
        {
            using var context = GetInMemoryDbContext();
            context.Documents.Add(new Document
            {
                Title = "Test Security Report",
                Category = "Audit & Compliance",
                ContentHtml = "<p>Test content</p>",
                Status = "Approved",
                CreatedByUserId = 1
            });
            await context.SaveChangesAsync();

            var controller = new DocumentsController(context);

            var result = await controller.GetDocuments(null);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var docs = Assert.IsAssignableFrom<IEnumerable<DocumentResponseDto>>(okResult.Value);
            Assert.NotEmpty(docs);
        }

        [Fact]
        public async Task CreateDocument_ValidDto_CreatesAndReturnsDocument()
        {
            using var context = GetInMemoryDbContext();
            var controller = new DocumentsController(context);

            var dto = new CreateDocumentDto
            {
                Title = "New Compliance Audit",
                Category = "Audit Report",
                ContentHtml = "<h1>Audit Report Title</h1><p>Audit body text.</p>",
                CreatedByUserId = 1,
                SubmitForReview = true
            };

            var result = await controller.CreateDocument(dto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var doc = Assert.IsType<DocumentResponseDto>(createdResult.Value);
            Assert.Equal("New Compliance Audit", doc.Title);
            Assert.Equal("Pending Review", doc.Status);
        }

        [Fact]
        public async Task UpdateDocumentStatus_TransitionToApproved_UpdatesDocument()
        {
            using var context = GetInMemoryDbContext();
            var doc = new Document
            {
                Title = "Pending Approval Document",
                ContentHtml = "<p>Content</p>",
                Status = "Pending Approval",
                CreatedByUserId = 1,
                ReviewedByUserId = 2
            };
            context.Documents.Add(doc);
            await context.SaveChangesAsync();

            var controller = new DocumentsController(context);

            var dto = new UpdateDocumentStatusDto
            {
                Status = "Approved",
                ActionByUserId = 8,
                ReviewerNotes = "Final sign-off complete."
            };

            var result = await controller.UpdateDocumentStatus(doc.Id, dto);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var updatedDoc = Assert.IsType<DocumentResponseDto>(okResult.Value);
            Assert.Equal("Approved", updatedDoc.Status);
            Assert.Equal(8, updatedDoc.ApprovedByUserId);
        }

        [Fact]
        public async Task DeleteDocument_ExistingId_RemovesRecord()
        {
            using var context = GetInMemoryDbContext();
            var doc = new Document
            {
                Title = "Draft Document to Delete",
                ContentHtml = "<p>Draft</p>",
                Status = "Draft",
                CreatedByUserId = 1
            };
            context.Documents.Add(doc);
            await context.SaveChangesAsync();

            var controller = new DocumentsController(context);

            var result = await controller.DeleteDocument(doc.Id);

            Assert.IsType<NoContentResult>(result);
            Assert.Null(await context.Documents.FindAsync(doc.Id));
        }
    }
}
