using AmbustockBackend.Repositories;
using AmbustockBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Registrar Repositories
builder.Services.AddScoped<IAmbulanciaRepository, AmbulanciaRepository>();
builder.Services.AddScoped<IZonaRepository, ZonaRepository>();
builder.Services.AddScoped<ICajonRepository, CajonRepository>();
builder.Services.AddScoped<IMaterialRepository, MaterialRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ICorreoRepository, CorreoRepository>();
builder.Services.AddScoped<IReposicionRepository, ReposicionRepository>();
builder.Services.AddScoped<IResponsableRepository, ResponsableRepository>();
builder.Services.AddScoped<IServicioRepository, ServicioRepository>();
builder.Services.AddScoped<IServicioAmbulanciaRepository, ServicioAmbulanciaRepository>();
builder.Services.AddScoped<IDetalleCorreoRepository, DetalleCorreoRepository>();

// Registrar Services
builder.Services.AddScoped<AmbulanciaService>();
builder.Services.AddScoped<ZonaService>();
builder.Services.AddScoped<CajonService>();
builder.Services.AddScoped<MaterialService>();
builder.Services.AddScoped<UsuarioService>();
builder.Services.AddScoped<CorreoService>();
builder.Services.AddScoped<ReposicionService>();
builder.Services.AddScoped<ResponsableService>();
builder.Services.AddScoped<ServicioService>();
builder.Services.AddScoped<ServicioAmbulanciaService>();
builder.Services.AddScoped<DetalleCorreoService>();

// Configurar CORS (opcional, útil para frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
