public class InventarioBase
{
    public int Id { get; set; }
    public int AmbulanciaId { get; set; }

    public Ambulancia Ambulancia { get; set; }

    public int ItemId { get; set; }
    public ItemInventario Item { get; set; }
    public int CantidadMinima { get; set; }

}