using Xunit;
using Moq;
using FluentAssertions;
using AmbustockBackend.Services;
using AmbustockBackend.Repositories;
using AmbustockBackend.Models;
using AmbustockBackend.Dtos;
using AmbuStock.Tests.Helpers;

namespace AmbuStock.Tests.Services
{
    public class RevisionServiceTests
    {
        private readonly Mock<IAmbulanciaRepository> _ambulanciaRepoMock;
        private readonly Mock<IZonaRepository>       _zonaRepoMock;
        private readonly Mock<ICajonRepository>      _cajonRepoMock;
        private readonly Mock<IMaterialRepository>   _materialRepoMock;
        private readonly Mock<IRevisionRepository>   _revisionRepoMock;
        private readonly RevisionService             _sut;

        public RevisionServiceTests()
        {
            _ambulanciaRepoMock = new Mock<IAmbulanciaRepository>();
            _zonaRepoMock       = new Mock<IZonaRepository>();
            _cajonRepoMock      = new Mock<ICajonRepository>();
            _materialRepoMock   = new Mock<IMaterialRepository>();
            _revisionRepoMock   = new Mock<IRevisionRepository>();

            _sut = new RevisionService(
                _ambulanciaRepoMock.Object,
                _zonaRepoMock.Object,
                _cajonRepoMock.Object,
                _materialRepoMock.Object,
                _revisionRepoMock.Object);
        }

        [Fact]
        public async Task GuardarRevisionAsync_TodosLosMaterilesCorrectos_EstadoCompletada()
        {
            _ambulanciaRepoMock.Setup(r => r.GetByIdAsync(1))
                               .ReturnsAsync(TestDataBuilder.CrearAmbulancia());

            Revision? revisionGuardada = null;
            _revisionRepoMock.Setup(r => r.AddAsync(It.IsAny<Revision>()))
                             .Callback<Revision>(r => revisionGuardada = r)
                             .ReturnsAsync((Revision r) => r);

            var dto = TestDataBuilder.CrearGuardarRevisionDto(zonas: new List<ZonaGuardarDto>
            {
                TestDataBuilder.CrearZonaConMaterialesCorrectos(cantidad: 5)
            });

            await _sut.GuardarRevisionAsync(dto);

            revisionGuardada!.Estado.Should().Be("completada");
            revisionGuardada.Total_Materiales.Should().Be(revisionGuardada.Materiales_Revisados);
        }

        [Fact]
        public async Task GuardarRevisionAsync_AlgunMaterialIncorrecto_EstadoPendiente()
        {
            _ambulanciaRepoMock.Setup(r => r.GetByIdAsync(1))
                               .ReturnsAsync(TestDataBuilder.CrearAmbulancia());

            Revision? revisionGuardada = null;
            _revisionRepoMock.Setup(r => r.AddAsync(It.IsAny<Revision>()))
                             .Callback<Revision>(r => revisionGuardada = r)
                             .ReturnsAsync((Revision r) => r);

            var dto = TestDataBuilder.CrearGuardarRevisionDto(zonas: new List<ZonaGuardarDto>
            {
                TestDataBuilder.CrearZonaConMaterialesIncompletos()
            });

            await _sut.GuardarRevisionAsync(dto);

            revisionGuardada!.Estado.Should().Be("pendiente");
            revisionGuardada.Materiales_Revisados.Should().BeLessThan(revisionGuardada.Total_Materiales);
        }

        [Fact]
        public async Task GuardarRevisionAsync_SinZonas_TotalesEnCeroYEstadoCompletada()
        {
            _ambulanciaRepoMock.Setup(r => r.GetByIdAsync(1))
                               .ReturnsAsync(TestDataBuilder.CrearAmbulancia());

            Revision? revisionGuardada = null;
            _revisionRepoMock.Setup(r => r.AddAsync(It.IsAny<Revision>()))
                             .Callback<Revision>(r => revisionGuardada = r)
                             .ReturnsAsync((Revision r) => r);

            var dto = TestDataBuilder.CrearGuardarRevisionDto(zonas: new List<ZonaGuardarDto>());

            await _sut.GuardarRevisionAsync(dto);

            revisionGuardada!.Total_Materiales.Should().Be(0);
            revisionGuardada.Materiales_Revisados.Should().Be(0);
            revisionGuardada.Estado.Should().Be("completada");
        }

        [Fact]
        public async Task GuardarRevisionAsync_MaterialesEnCajones_SeSumanAlTotal()
        {
            _ambulanciaRepoMock.Setup(r => r.GetByIdAsync(1))
                               .ReturnsAsync(TestDataBuilder.CrearAmbulancia());

            Revision? revisionGuardada = null;
            _revisionRepoMock.Setup(r => r.AddAsync(It.IsAny<Revision>()))
                             .Callback<Revision>(r => revisionGuardada = r)
                             .ReturnsAsync((Revision r) => r);

            var dto = TestDataBuilder.CrearGuardarRevisionDto(zonas: new List<ZonaGuardarDto>
            {
                new ZonaGuardarDto
                {
                    NombreZona = "Zona A",
                    Materiales = new List<MaterialGuardarDto>
                    {
                        new() { NombreProducto = "Venda", Cantidad = 5, CantidadRevisada = 5 }
                    },
                    Cajones = new List<CajonGuardarDto>
                    {
                        new CajonGuardarDto
                        {
                            NombreCajon = "Cajón 1",
                            Materiales  = new List<MaterialGuardarDto>
                            {
                                new() { NombreProducto = "Guante",    Cantidad = 3, CantidadRevisada = 3 },
                                new() { NombreProducto = "Mascarilla", Cantidad = 7, CantidadRevisada = 4 }
                            }
                        }
                    }
                }
            });

            await _sut.GuardarRevisionAsync(dto);

            revisionGuardada!.Total_Materiales.Should().Be(3);
            revisionGuardada.Materiales_Revisados.Should().Be(2);
            revisionGuardada.Estado.Should().Be("pendiente");
        }

        [Fact]
        public async Task GuardarRevisionAsync_ZonasConNulos_NoLanzaExcepcion()
        {
            _ambulanciaRepoMock.Setup(r => r.GetByIdAsync(1))
                               .ReturnsAsync(TestDataBuilder.CrearAmbulancia());
            _revisionRepoMock.Setup(r => r.AddAsync(It.IsAny<Revision>()))
                             .ReturnsAsync((Revision r) => r);

            var dto = TestDataBuilder.CrearGuardarRevisionDto(zonas: new List<ZonaGuardarDto>
            {
                new ZonaGuardarDto
                {
                    NombreZona = "Zona A",
                    Materiales = null!,
                    Cajones    = null!
                }
            });

            var accion = async () => await _sut.GuardarRevisionAsync(dto);

            await accion.Should().NotThrowAsync();
        }

        [Fact]
        public async Task GuardarRevisionAsync_AmbulanciaNoExiste_LanzaExcepcion()
        {
            _ambulanciaRepoMock.Setup(r => r.GetByIdAsync(99))
                               .ReturnsAsync((Ambulancia?)null);

            var dto = TestDataBuilder.CrearGuardarRevisionDto(idAmbulancia: 99);

            var accion = async () => await _sut.GuardarRevisionAsync(dto);

            await accion.Should().ThrowAsync<Exception>().WithMessage("*99*");
        }

        [Fact]
        public async Task GetRevisionPorAmbulanciaAsync_AmbulanciaExiste_DevuelveDtoCompleto()
        {
            var ambulancia = TestDataBuilder.CrearAmbulancia(id: 1, nombre: "Alpha", matricula: "1234-XYZ");
            _ambulanciaRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(ambulancia);
            _zonaRepoMock.Setup(r => r.GetByAmbulanciaIdAsync(1)).ReturnsAsync(new List<Zonas>());

            var resultado = await _sut.GetRevisionPorAmbulanciaAsync(1);

            resultado.IdAmbulancia.Should().Be(1);
            resultado.NombreAmbulancia.Should().Be("Alpha");
            resultado.Matricula.Should().Be("1234-XYZ");
            resultado.Zonas.Should().BeEmpty();
        }

        [Fact]
        public async Task GetRevisionPorAmbulanciaAsync_AmbulanciaNoExiste_LanzaExcepcion()
        {
            _ambulanciaRepoMock.Setup(r => r.GetByIdAsync(404)).ReturnsAsync((Ambulancia?)null);

            var accion = async () => await _sut.GetRevisionPorAmbulanciaAsync(404);

            await accion.Should().ThrowAsync<Exception>().WithMessage("*404*");
        }

     
        [Fact]
        public async Task GetHistorialAsync_ConRevisiones_DevuelveOrdenadoPorFechaDesc()
        {
            var revisiones = new List<Revision>
            {
                new Revision { Id_revision = 1, Id_ambulancia = 1, Nombre_Responsable = "Ana",
                    Fecha_Revision = new DateTime(2025, 1, 10), Total_Materiales = 5,
                    Materiales_Revisados = 5, Estado = "completada", Id_servicio = 1 },
                new Revision { Id_revision = 2, Id_ambulancia = 1, Nombre_Responsable = "Luis",
                    Fecha_Revision = new DateTime(2025, 3, 20), Total_Materiales = 8,
                    Materiales_Revisados = 6, Estado = "pendiente", Id_servicio = 1 },
            };

            _revisionRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(revisiones);
            _ambulanciaRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(TestDataBuilder.CrearAmbulancia());

            var resultado = (await _sut.GetHistorialAsync()).ToList();

            resultado.First().FechaRevision.Should().BeAfter(resultado.Last().FechaRevision);
        }

        [Fact]
        public async Task GetHistorialAsync_AmbulanciaDesaparecida_UsaNA()
        {
            var revisiones = new List<Revision>
            {
                new Revision { Id_revision = 1, Id_ambulancia = 999, Nombre_Responsable = "Ana",
                    Fecha_Revision = DateTime.Now, Total_Materiales = 2,
                    Materiales_Revisados = 2, Estado = "completada", Id_servicio = 1 }
            };

            _revisionRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(revisiones);
            _ambulanciaRepoMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Ambulancia?)null);

            var resultado = (await _sut.GetHistorialAsync()).ToList();

            resultado.First().NombreAmbulancia.Should().Be("N/A");
            resultado.First().Matricula.Should().Be("N/A");
        }

        [Fact]
        public async Task GetRevisionByIdAsync_RevisionExiste_DevuelveDetalle()
        {
            var revision   = TestDataBuilder.CrearRevision(id: 5, total: 10, revisados: 8, estado: "pendiente");
            var ambulancia = TestDataBuilder.CrearAmbulancia(id: 1);

            _revisionRepoMock.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(revision);
            _ambulanciaRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(ambulancia);

            var resultado = await _sut.GetRevisionByIdAsync(5);

            resultado.Should().NotBeNull();
            resultado!.IdRevision.Should().Be(5);
            resultado.Estado.Should().Be("pendiente");
            resultado.TotalMateriales.Should().Be(10);
            resultado.MaterialesRevisados.Should().Be(8);
        }

        [Fact]
        public async Task GetRevisionByIdAsync_RevisionNoExiste_DevuelveNull()
        {
            _revisionRepoMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Revision?)null);

            var resultado = await _sut.GetRevisionByIdAsync(999);

            resultado.Should().BeNull();
        }
    }
}