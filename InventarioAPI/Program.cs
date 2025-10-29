using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
    // Define una política llamada "AllowVueApp"
    options.AddPolicy("AllowVueApp",
        policy =>
        {
            // Permite peticiones de tu frontend Vue.js (http://localhost:8080)
            // Usamos AllowAnyOrigin por si el puerto de Vue cambia, pero es mejor especificar
            policy.AllowAnyOrigin() 
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
// ---------------------------------------------


builder.Services.AddControllers();
builder.Services.AddOpenApi();


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? 
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

// Asegúrate de que el namespace AppDbContext esté disponible
// Ejemplo: using InventarioAPI.Data;
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));


var app = builder.Build();

app.UseCors("AllowVueApp"); 
// --------------------------------------------------------------------


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();


app.Run();