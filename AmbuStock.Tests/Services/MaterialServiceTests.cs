using Xunit;
using Moq;
using FluentAssertions;
using AmbustockBackend.Services;
using AmbustockBackend.Repositories;
using AmbustockBackend.Models;
using AmbustockBackend.Dtos;
using AmbuStock.Tests.Helpers;
using Microsoft.AspNetCore.Http;

namespace AmbuStock.Tests.Services
{
    public class MaterialServiceTests
    {
        private readonly Mock<IMaterialRepository> _repoMock;
        private readonly Mock<ICloudinaryService>  _cloudinaryMock;
        private readonly MaterialService           _sut;

        public MaterialServiceTests()
        {
            _repoMock       = new Mock<IMaterialRepository>();
            _cloudinaryMock = new Mock<ICloudinaryService>();
            _sut            = new MaterialService(_repoMock.Object, _cloudinaryMock.Object);
        }

        [Fact]
        public async Task GetByIdAsync_MaterialExiste_DevuelveDto()
        {
            var material = TestDataBuilder.CrearMaterial(id: 1, nombre: "Vendas elásticas", cantidad: 10);
            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(material);

            var resultado = await _sut.GetByIdAsync(1);

            resultado.Should().NotBeNull();
            resultado.IdMaterial.Should().Be(1);
            resultado.NombreProducto.Should().Be("Vendas elásticas");
            resultado.Cantidad.Should().Be(10);
        }

        [Fact]
        public async Task GetByIdAsync_MaterialNoExiste_LanzaExcepcion()
        {
            _repoMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Materiales?)null);

            var accion = async () => await _sut.GetByIdAsync(999);

            await accion.Should().ThrowAsync<Exception>().WithMessage("*999*");
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        [InlineData(-100)]
        public async Task GetByIdAsync_IdFueraDeLimite_LanzaExcepcion(int idInvalido)
        {
            _repoMock.Setup(r => r.GetByIdAsync(idInvalido)).ReturnsAsync((Materiales?)null);

            var accion = async () => await _sut.GetByIdAsync(idInvalido);

            await accion.Should().ThrowAsync<Exception>();
        }

        [Fact]
        public async Task GetAllAsync_HayMateriales_DevuelveListaCompleta()
        {
            var materiales = new List<Materiales>
            {
                TestDataBuilder.CrearMaterial(id: 1, nombre: "Vendas"),
                TestDataBuilder.CrearMaterial(id: 2, nombre: "Guantes"),
                TestDataBuilder.CrearMaterial(id: 3, nombre: "Mascarillas")
            };
            _repoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(materiales);

            var resultado = await _sut.GetAllAsync();

            resultado.Should().HaveCount(3);
        }

        [Fact]
        public async Task GetAllAsync_SinMateriales_DevuelveListaVacia()
        {
            _repoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Materiales>());

            var resultado = await _sut.GetAllAsync();

            resultado.Should().NotBeNull().And.BeEmpty();
        }

        [Fact]
        public async Task CreateAsync_DtoValidoConCajon_DevuelveDtoCreado()
        {
            var dto            = TestDataBuilder.CrearMaterialDto(nombre: "Torniquete", cantidad: 5, idZona: 1, idCajon: 2);
            var materialCreado = TestDataBuilder.CrearMaterial(id: 10, nombre: "Torniquete", cantidad: 5, idZona: 1, idCajon: 2);
            _repoMock.Setup(r => r.AddAsync(It.IsAny<Materiales>())).ReturnsAsync(materialCreado);

            var resultado = await _sut.CreateAsync(dto);

            resultado.IdMaterial.Should().Be(10);
            resultado.NombreProducto.Should().Be("Torniquete");
            resultado.IdCajon.Should().Be(2);
            _repoMock.Verify(r => r.AddAsync(It.IsAny<Materiales>()), Times.Once);
        }

        [Fact]
        public async Task CreateAsync_DtoSinCajon_NombreCajonEsNull()
        {
            var dto            = TestDataBuilder.CrearMaterialDto(idCajon: null);
            var materialCreado = TestDataBuilder.CrearMaterial(idCajon: null);
            _repoMock.Setup(r => r.AddAsync(It.IsAny<Materiales>())).ReturnsAsync(materialCreado);

            var resultado = await _sut.CreateAsync(dto);

            resultado.IdCajon.Should().BeNull();
            resultado.NombreCajon.Should().BeNull();
        }

        [Fact]
        public async Task CreateAsync_CantidadCero_CreaCorrectamente()
        {
            var dto            = TestDataBuilder.CrearMaterialDto(cantidad: 0);
            var materialCreado = TestDataBuilder.CrearMaterial(cantidad: 0);
            _repoMock.Setup(r => r.AddAsync(It.IsAny<Materiales>())).ReturnsAsync(materialCreado);

            var resultado = await _sut.CreateAsync(dto);

            resultado.Cantidad.Should().Be(0);
        }

        [Fact]
        public async Task UpdateAsync_ConNuevaZonaYCajon_ActualizaAmbos()
        {
            var materialExistente = TestDataBuilder.CrearMaterial(id: 1, idZona: 1, idCajon: 1);
            var dto = TestDataBuilder.CrearUpdateMaterialDto(nombre: "Actualizado", cantidad: 20, idZona: 2, idCajon: 3);
            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(materialExistente);
            _repoMock.Setup(r => r.UpdateAsync(It.IsAny<Materiales>())).Returns(Task.CompletedTask);

            var resultado = await _sut.UpdateAsync(1, dto);

            resultado.IdZona.Should().Be(2);
            resultado.IdCajon.Should().Be(3);
        }

        [Fact]
        public async Task UpdateAsync_SinNuevaZonaNiCajon_MantieneValoresOriginales()
        {
            var materialExistente = TestDataBuilder.CrearMaterial(id: 1, idZona: 5, idCajon: 7);
            var dto = new UpdateMaterialDto
            {
                NombreProducto = "Nuevo nombre",
                Cantidad       = 15,
                IdZona         = null,
                IdCajon        = null
            };
            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(materialExistente);
            _repoMock.Setup(r => r.UpdateAsync(It.IsAny<Materiales>())).Returns(Task.CompletedTask);

            var resultado = await _sut.UpdateAsync(1, dto);

            resultado.IdZona.Should().Be(5);
            resultado.IdCajon.Should().Be(7);
        }

        [Fact]
        public async Task UpdateAsync_MaterialNoExiste_LanzaExcepcion()
        {
            _repoMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Materiales?)null);

            var accion = async () => await _sut.UpdateAsync(999, TestDataBuilder.CrearUpdateMaterialDto());

            await accion.Should().ThrowAsync<Exception>().WithMessage("*999*");
        }

        [Fact]
        public async Task DeleteAsync_MaterialConFoto_EliminaFotoYRegistro()
        {
            _repoMock.Setup(r => r.GetFotoPublicIdAsync(1)).ReturnsAsync("pub-xyz");
            _cloudinaryMock.Setup(c => c.EliminarImagenAsync("pub-xyz")).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.DeleteAsync(1)).Returns(Task.CompletedTask);

            await _sut.DeleteAsync(1);

            _cloudinaryMock.Verify(c => c.EliminarImagenAsync("pub-xyz"), Times.Once);
            _repoMock.Verify(r => r.DeleteAsync(1), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_MaterialSinFoto_SaltaCloudinaryYBorraRegistro()
        {
            _repoMock.Setup(r => r.GetFotoPublicIdAsync(1)).ReturnsAsync((string?)null);
            _repoMock.Setup(r => r.DeleteAsync(1)).Returns(Task.CompletedTask);

            await _sut.DeleteAsync(1);

            _cloudinaryMock.Verify(c => c.EliminarImagenAsync(It.IsAny<string>()), Times.Never);
            _repoMock.Verify(r => r.DeleteAsync(1), Times.Once);
        }

        [Fact]
        public async Task EliminarFotoAsync_TieneFoto_EliminaDeCloudinaryYBD()
        {
            _repoMock.Setup(r => r.GetFotoPublicIdAsync(5)).ReturnsAsync("pub-id-abc");
            _cloudinaryMock.Setup(c => c.EliminarImagenAsync("pub-id-abc")).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.UpdateFotoAsync(5, null!, null!)).Returns(Task.CompletedTask);

            await _sut.EliminarFotoAsync(5);

            _cloudinaryMock.Verify(c => c.EliminarImagenAsync("pub-id-abc"), Times.Once);
            _repoMock.Verify(r => r.UpdateFotoAsync(5, null!, null!), Times.Once);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        public async Task EliminarFotoAsync_SinFoto_NoLlamaCloudinary(string? publicId)
        {
            _repoMock.Setup(r => r.GetFotoPublicIdAsync(5)).ReturnsAsync(publicId);
            _repoMock.Setup(r => r.UpdateFotoAsync(5, null!, null!)).Returns(Task.CompletedTask);

            await _sut.EliminarFotoAsync(5);

            _cloudinaryMock.Verify(c => c.EliminarImagenAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task SubirFotoAsync_MaterialConFotoPrevia_EliminaAntesDeSub()
        {
            var material = TestDataBuilder.CrearMaterial(id: 1, fotoUrl: "https://old.jpg", fotoPublicId: "old-pub-id");
            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(material);
            _cloudinaryMock.Setup(c => c.EliminarImagenAsync("old-pub-id")).Returns(Task.CompletedTask);
            _cloudinaryMock.Setup(c => c.SubirImagenAsync(It.IsAny<IFormFile>(), It.IsAny<string>()))
                           .ReturnsAsync(("https://new.jpg", "new-pub-id"));
            _repoMock.Setup(r => r.UpdateFotoAsync(1, "https://new.jpg", "new-pub-id")).Returns(Task.CompletedTask);

            var resultado = await _sut.SubirFotoAsync(1, new Mock<IFormFile>().Object);

            _cloudinaryMock.Verify(c => c.EliminarImagenAsync("old-pub-id"), Times.Once);
            _cloudinaryMock.Verify(c => c.SubirImagenAsync(It.IsAny<IFormFile>(), It.IsAny<string>()), Times.Once);
            resultado.FotoUrl.Should().Be("https://new.jpg");
        }

        [Fact]
        public async Task SubirFotoAsync_MaterialSinFotoPrevia_SubeDirectamente()
        {
            var material = TestDataBuilder.CrearMaterial(id: 1, fotoUrl: null, fotoPublicId: null);
            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(material);
            _cloudinaryMock.Setup(c => c.SubirImagenAsync(It.IsAny<IFormFile>(), It.IsAny<string>()))
                           .ReturnsAsync(("https://nueva.jpg", "nueva-pub-id"));
            _repoMock.Setup(r => r.UpdateFotoAsync(1, "https://nueva.jpg", "nueva-pub-id")).Returns(Task.CompletedTask);

            await _sut.SubirFotoAsync(1, new Mock<IFormFile>().Object);

            _cloudinaryMock.Verify(c => c.EliminarImagenAsync(It.IsAny<string>()), Times.Never);
            _cloudinaryMock.Verify(c => c.SubirImagenAsync(It.IsAny<IFormFile>(), It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task GetByCantidadBajaAsync_UmbralUno_DevuelveCantidadCero()
        {
            var materiales = new List<Materiales> { TestDataBuilder.CrearMaterial(id: 1, cantidad: 0) };
            _repoMock.Setup(r => r.GetByCantidadBajaAsync(1)).ReturnsAsync(materiales);

            var resultado = await _sut.GetByCantidadBajaAsync(1);

            resultado.Should().HaveCount(1);
            resultado.First().Cantidad.Should().Be(0);
        }

        [Theory]
        [InlineData(5)]
        [InlineData(10)]
        [InlineData(100)]
        public async Task GetByCantidadBajaAsync_UmbralValido_LlamaRepoConElValorCorrecto(int umbral)
        {
            _repoMock.Setup(r => r.GetByCantidadBajaAsync(umbral)).ReturnsAsync(new List<Materiales>());

            await _sut.GetByCantidadBajaAsync(umbral);

            _repoMock.Verify(r => r.GetByCantidadBajaAsync(umbral), Times.Once);
        }

        [Fact]
        public async Task GetByIdAsync_MaterialConZonaYCajon_MapeaNombresCorrectamente()
        {
            var material = TestDataBuilder.CrearMaterial(idCajon: 2);
            material.Zona  = new Zonas   { IdZona = 1, NombreZona  = "Zona Trauma" };
            material.Cajon = new Cajones { IdCajon = 2, NombreCajon = "Cajón Rojo" };
            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(material);

            var dto = await _sut.GetByIdAsync(1);

            dto.NombreZona.Should().Be("Zona Trauma");
            dto.NombreCajon.Should().Be("Cajón Rojo");
        }
        
        [Fact]
        public async Task GetByIdAsync_MaterialSinCajon_NombreCajonEsNull()
        {
            var material = TestDataBuilder.CrearMaterial(idCajon: null);
            material.Cajon = null;
            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(material);

            var dto = await _sut.GetByIdAsync(1);

            dto.NombreCajon.Should().BeNull();
        }
    }
}