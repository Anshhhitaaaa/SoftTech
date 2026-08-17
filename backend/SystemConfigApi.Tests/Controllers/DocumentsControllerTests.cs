using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SystemConfigApi.Controllers;
using SystemConfigApi.Data;
using SystemConfigApi.DTOs;
using SystemConfigApi.Features.Documents.Commands;
using SystemConfigApi.Features.Documents.Queries;
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
        public async Task GetDocumentsQuery_ReturnsList()
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

            var handler = new GetDocumentsQueryHandler(context);
            var result = await handler.Handle(new GetDocumentsQuery(null), CancellationToken.None);

            Assert.NotEmpty(result);
            Assert.Contains(result, d => d.Title == "Test Security Report");
        }

        [Fact]
        public async Task CreateDocumentCommand_ValidDto_CreatesAndReturnsDocument()
        {
            using var context = GetInMemoryDbContext();
            var handler = new CreateDocumentCommandHandler(context);

            var dto = new CreateDocumentDto
            {
                Title = "New Compliance Audit",
                Category = "Audit Report",
                ContentHtml = "<h1>Audit Report Title</h1><p>Audit body text.</p>",
                CreatedByUserId = 1,
                SubmitForReview = true
            };

            var doc = await handler.Handle(new CreateDocumentCommand(dto), CancellationToken.None);

            Assert.Equal("New Compliance Audit", doc.Title);
            Assert.Equal("Pending Review", doc.Status);
        }

        [Fact]
        public async Task UpdateDocumentStatusCommand_TransitionToApproved_UpdatesDocument()
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

            var handler = new UpdateDocumentStatusCommandHandler(context);

            var dto = new UpdateDocumentStatusDto
            {
                Status = "Approved",
                ActionByUserId = 8,
                ReviewerNotes = "Final sign-off complete."
            };

            var updatedDoc = await handler.Handle(new UpdateDocumentStatusCommand(doc.Id, dto), CancellationToken.None);

            Assert.NotNull(updatedDoc);
            Assert.Equal("Approved", updatedDoc!.Status);
            Assert.Equal(8, updatedDoc.ApprovedByUserId);
        }

        [Fact]
        public async Task DeleteDocumentCommand_ExistingId_RemovesRecord()
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

            var handler = new DeleteDocumentCommandHandler(context);

            var result = await handler.Handle(new DeleteDocumentCommand(doc.Id), CancellationToken.None);

            Assert.True(result);
            Assert.Null(await context.Documents.FindAsync(doc.Id));
        }
    }
}
