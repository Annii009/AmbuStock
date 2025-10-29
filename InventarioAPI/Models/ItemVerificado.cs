public class ItemVerificado
{
    public int Id { get; set; }
    public int ChecklistId { get; set; }
    public ChecklistServicio Checklist { get; set; }
    
    public int ItemId { get; set; }
    public string ItemNombre { get; set; } = string.Empty;
    
    public int CantidadMinima { get; set; }
    public int CantidadEncontrada { get; set; }
    
    public bool NecesitaReabastecimiento { get; set; }
}