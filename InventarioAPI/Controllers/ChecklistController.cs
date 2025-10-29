using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class ChecklistController : ControllerBase
{
    private readonly AppDbContext _context;

    // Clase DTO (Data Transfer Object) para el inicio de la revisión
    public class ChecklistItemDto 
    {
        public int ItemId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int CantidadMinima { get; set; }
        public int CantidadEncontrada { get; set; } = 0;
    }

    public ChecklistController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Checklist/iniciar/1 (Obtiene el inventario base para el ID de ambulancia)
    [HttpGet("iniciar/{ambulanciaId}")]
    public async Task<ActionResult<IEnumerable<ChecklistItemDto>>> IniciarRevision(int ambulanciaId)
    {
        var inventarioBase = await _context.InventariosBase
            .Where(ib => ib.AmbulanciaId == ambulanciaId)
            .Include(ib => ib.Item)
            .Select(ib => new ChecklistItemDto
            {
                ItemId = ib.ItemId,
                Nombre = ib.Item.Nombre, 
                CantidadMinima = ib.CantidadMinima
            })
            .ToListAsync();

        if (!inventarioBase.Any())
        {
            return NotFound("Inventario base no definido para esta ambulancia.");
        }

        return Ok(inventarioBase);
    }
    
    // POST: api/Checklist/finalizar (Guarda los resultados del checklist)
    [HttpPost("finalizar")]
    public async Task<ActionResult> FinalizarRevision([FromBody] ChecklistServicio checklist)
    {
        if (checklist.ItemsVerificados == null || !checklist.ItemsVerificados.Any())
        {
            return BadRequest("No se recibieron ítems verificados.");
        }

        checklist.FechaHora = DateTime.Now;
        checklist.UsuarioNombre = "usuario.prueba"; // Usuario fijo de prueba
        
        var ambulancia = await _context.Ambulancias.FindAsync(checklist.AmbulanciaId);
        checklist.AmbulanciaCodigo = ambulancia?.Codigo ?? "N/A";

        // Procesa la lógica de faltantes (stock 0 o insuficiente)
        foreach (var item in checklist.ItemsVerificados)
        {
            item.NecesitaReabastecimiento = item.CantidadEncontrada < item.CantidadMinima;
        }

        // Guarda el registro completo
        _context.ChecklistsServicio.Add(checklist);
        await _context.SaveChangesAsync();
        
        // Retorna el resultado al frontend (sin enviar email)
        return Ok(new { 
            Mensaje = "Revisión guardada con éxito.",
            ItemsFaltantes = checklist.ItemsVerificados.Count(i => i.NecesitaReabastecimiento)
        });
    }
}