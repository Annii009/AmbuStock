using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

public class AppDbContext : IdentityDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Ambulancia> Ambulancias { get; set; }
    public DbSet<ItemInventario> ItemsInventario { get; set; }
    public DbSet<InventarioBase> InventariosBase { get; set; }
    public DbSet<ChecklistServicio> ChecklistsServicio { get; set; }
    public DbSet<ItemVerificado> ItemsVerificados { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<InventarioBase>()
        .HasIndex(ib => new { ib.AmbulanciaId, ib.ItemId })
        .IsUnique();
    }


}