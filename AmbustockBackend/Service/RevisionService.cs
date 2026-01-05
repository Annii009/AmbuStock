using AmbustockBackend.Repositories;
using AmbustockBackend.Dtos;

namespace AmbustockBackend.Services
{
    public class RevisionService
    {
        private readonly IAmbulanciaRepository _ambulanciaRepository;
        private readonly IZonaRepository _zonaRepository;
        private readonly ICajonRepository _cajonRepository;
        private readonly IMaterialRepository _materialRepository;

        public RevisionService(
            IAmbulanciaRepository ambulanciaRepository,
            IZonaRepository zonaRepository,
            ICajonRepository cajonRepository,
            IMaterialRepository materialRepository)
        {
            _ambulanciaRepository = ambulanciaRepository;
            _zonaRepository = zonaRepository;
            _cajonRepository = cajonRepository;
            _materialRepository = materialRepository;
        }

        public async Task<RevisionAmbulanciaDto> GetRevisionPorAmbulanciaAsync(int idAmbulancia)
        {
            var ambulancia = await _ambulanciaRepository.GetByIdAsync(idAmbulancia);
            if (ambulancia == null)
                throw new Exception($"Ambulancia con ID {idAmbulancia} no encontrada");

            var zonas = await _zonaRepository.GetByAmbulanciaIdAsync(idAmbulancia);
            
            var zonasDto = new List<ZonaRevisionDto>();

            foreach (var zona in zonas)
            {
                var cajones = await _cajonRepository.GetByZonaIdAsync(zona.IdZona);
                var materialesSinCajon = await _materialRepository.GetByZonaSinCajonAsync(zona.IdZona);
                
                var cajonesDto = new List<CajonRevisionDto>();
                
                foreach (var cajon in cajones)
                {
                    var materialesCajon = await _materialRepository.GetByCajonIdAsync(cajon.IdCajon);
                    
                    cajonesDto.Add(new CajonRevisionDto
                    {
                        IdCajon = cajon.IdCajon,
                        NombreCajon = cajon.NombreCajon,
                        Materiales = materialesCajon.Select(m => new MaterialRevisionDto
                        {
                            IdMaterial = m.IdMaterial,
                            NombreProducto = m.NombreProducto,
                            Cantidad = m.Cantidad,
                            Revisado = false
                        }).ToList()
                    });
                }
                
                zonasDto.Add(new ZonaRevisionDto
                {
                    IdZona = zona.IdZona,
                    NombreZona = zona.NombreZona,
                    Cajones = cajonesDto,
                    Materiales = materialesSinCajon.Select(m => new MaterialRevisionDto
                    {
                        IdMaterial = m.IdMaterial,
                        NombreProducto = m.NombreProducto,
                        Cantidad = m.Cantidad,
                        Revisado = false
                    }).ToList()
                });
            }

            return new RevisionAmbulanciaDto
            {
                IdAmbulancia = ambulancia.IdAmbulancia,
                NombreAmbulancia = ambulancia.Nombre,
                Matricula = ambulancia.Matricula,
                Zonas = zonasDto
            };
        }
    }
}
