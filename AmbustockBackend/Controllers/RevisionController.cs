using Microsoft.AspNetCore.Mvc;
using AmbustockBackend.Services;
using AmbustockBackend.Dtos;

namespace AmbustockBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RevisionController : ControllerBase
    {
        private readonly RevisionService _service;

        public RevisionController(RevisionService service)
        {
            _service = service;
        }

        [HttpGet("ambulancia/{idAmbulancia}")]
        public async Task<ActionResult<RevisionAmbulanciaDto>> GetRevisionPorAmbulancia(int idAmbulancia)
        {
            try
            {
                var revision = await _service.GetRevisionPorAmbulanciaAsync(idAmbulancia);
                return Ok(revision);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
