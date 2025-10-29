

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class AmbulanciaController : ControllerBase
{
    private readonly AppDbContext _context;

    public AmbulanciaController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Ambulancia
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ambulancia>>> GetAmbulancias()
    {
        var ambulancias = await _context.Ambulancias
        .Select(a => new Ambulancia
        {
            Id = a.Id,
            Codigo = a.Codigo
        }).ToListAsync();

        return Ok(ambulancias);
    }
}