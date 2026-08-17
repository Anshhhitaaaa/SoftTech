using MediatR;
using SystemConfigApi.Data;

namespace SystemConfigApi.Features.Documents.Commands
{
    public record DeleteDocumentCommand(int Id) : IRequest<bool>;

    public class DeleteDocumentCommandHandler : IRequestHandler<DeleteDocumentCommand, bool>
    {
        private readonly AppDbContext _context;

        public DeleteDocumentCommandHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteDocumentCommand request, CancellationToken cancellationToken)
        {
            var doc = await _context.Documents.FindAsync(new object[] { request.Id }, cancellationToken);
            if (doc == null) return false;

            _context.Documents.Remove(doc);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
