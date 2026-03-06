using AmbustockBackend.Models;
using AmbustockBackend.Dtos;

namespace AmbuStock.Tests.Helpers
{
    public static class TestDataBuilder
    {
        // ─── Materiales ───────────────────────────────────────────────────────────

        public static Materiales CrearMaterial(
            int id = 1,
            string nombre = "Vendas elásticas",
            int cantidad = 10,
            int idZona = 1,
            int? idCajon = null,
            string? fotoUrl = null,
            string? fotoPublicId = null)
        {
            return new Materiales
            {
                IdMaterial     = id,
                NombreProducto = nombre,
                Cantidad       = cantidad,
                IdZona         = idZona,
                IdCajon        = idCajon,
                Zona           = new Zonas { IdZona = idZona, NombreZona = "Zona A" },
                Cajon          = idCajon.HasValue
                                     ? new Cajones { IdCajon = idCajon.Value, NombreCajon = "Cajón 1" }
                                     : null,
                FotoUrl        = fotoUrl,
                FotoPublicId   = fotoPublicId
            };
        }

        public static CreateMaterialDto CrearMaterialDto(
            string nombre = "Vendas elásticas",
            int cantidad = 10,
            int idZona = 1,
            int? idCajon = null)
        {
            return new CreateMaterialDto
            {
                NombreProducto = nombre,
                Cantidad       = cantidad,
                IdZona         = idZona,
                IdCajon        = idCajon
            };
        }

        public static UpdateMaterialDto CrearUpdateMaterialDto(
            string nombre = "Vendas elásticas actualizado",
            int cantidad = 20,
            int? idZona = 2,
            int? idCajon = 3)
        {
            return new UpdateMaterialDto
            {
                NombreProducto = nombre,
                Cantidad       = cantidad,
                IdZona         = idZona,
                IdCajon        = idCajon
            };
        }

        // ─── Ambulancia ───────────────────────────────────────────────────────────

        public static Ambulancia CrearAmbulancia(
            int id = 1,
            string nombre = "Ambulancia Alpha",
            string matricula = "1234-ABC")
        {
            return new Ambulancia
            {
                IdAmbulancia = id,
                Nombre       = nombre,
                Matricula    = matricula
            };
        }

        // ─── Zonas / Cajones ──────────────────────────────────────────────────────

        public static Zonas CrearZona(int id = 1, string nombre = "Zona A", int idAmbulancia = 1)
            => new Zonas { IdZona = id, NombreZona = nombre, IdAmbulancia = idAmbulancia };

        public static Cajones CrearCajon(int id = 1, string nombre = "Cajón 1", int idZona = 1)
            => new Cajones { IdCajon = id, NombreCajon = nombre, IdZona = idZona };

        // ─── Revisiones ───────────────────────────────────────────────────────────

        public static Revision CrearRevision(
            int id = 1,
            int idAmbulancia = 1,
            int idServicio = 1,
            string responsable = "Ana López",
            int total = 10,
            int revisados = 10,
            string estado = "completada")
        {
            return new Revision
            {
                Id_revision          = id,
                Id_ambulancia        = idAmbulancia,
                Id_servicio          = idServicio,
                Nombre_Responsable   = responsable,
                Fecha_Revision       = new DateTime(2025, 6, 1),
                Total_Materiales     = total,
                Materiales_Revisados = revisados,
                Estado               = estado
            };
        }

        public static GuardarRevisionDto CrearGuardarRevisionDto(
            int idAmbulancia = 1,
            int idServicio = 1,
            List<ZonaGuardarDto>? zonas = null)
        {
            return new GuardarRevisionDto
            {
                IdAmbulancia      = idAmbulancia,
                IdServicio        = idServicio,
                NombreResponsable = "Ana López",
                FechaRevision     = new DateTime(2025, 6, 1),
                Zonas             = zonas ?? new List<ZonaGuardarDto>()
            };
        }

        /// <summary>Zona con materiales donde CantidadRevisada == Cantidad (todos correctos).</summary>
        public static ZonaGuardarDto CrearZonaConMaterialesCorrectos(int cantidad = 5)
        {
            return new ZonaGuardarDto
            {
                NombreZona = "Zona A",
                Materiales = Enumerable.Range(1, 3).Select(_ => new MaterialGuardarDto
                {
                    NombreProducto   = "Venda",
                    Cantidad         = cantidad,
                    CantidadRevisada = cantidad
                }).ToList(),
                Cajones = new List<CajonGuardarDto>()
            };
        }

        /// <summary>Zona con un material correcto y uno incompleto.</summary>
        public static ZonaGuardarDto CrearZonaConMaterialesIncompletos()
        {
            return new ZonaGuardarDto
            {
                NombreZona = "Zona A",
                Materiales = new List<MaterialGuardarDto>
                {
                    new() { NombreProducto = "Venda",   Cantidad = 10, CantidadRevisada = 10 },
                    new() { NombreProducto = "Guante",  Cantidad = 5,  CantidadRevisada = 3  }
                },
                Cajones = new List<CajonGuardarDto>()
            };
        }
    }
}