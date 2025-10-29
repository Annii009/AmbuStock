public class ChecklistServicio
{
    public int Id { get; set; }
    public int AmbulanciaId { get; set; }
    public string AmbulanciaCodigo { get; set; } = string.Empty;
    
    public DateTime FechaHora { get; set; }
    public string UsuarioNombre { get; set; } = string.Empty;
    
    public ICollection<ItemVerificado> ItemsVerificados { get; set; } = new List<ItemVerificado>();
}