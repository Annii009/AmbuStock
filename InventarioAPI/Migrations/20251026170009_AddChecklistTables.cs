using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetoCruzRoja.Migrations
{
    /// <inheritdoc />
    public partial class AddChecklistTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChecklistsServicio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AmbulanciaId = table.Column<int>(type: "int", nullable: false),
                    AmbulanciaCodigo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaHora = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UsuarioNombre = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChecklistsServicio", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ItemsVerificados",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChecklistId = table.Column<int>(type: "int", nullable: false),
                    ItemId = table.Column<int>(type: "int", nullable: false),
                    ItemNombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CantidadMinima = table.Column<int>(type: "int", nullable: false),
                    CantidadEncontrada = table.Column<int>(type: "int", nullable: false),
                    NecesitaReabastecimiento = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemsVerificados", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemsVerificados_ChecklistsServicio_ChecklistId",
                        column: x => x.ChecklistId,
                        principalTable: "ChecklistsServicio",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItemsVerificados_ChecklistId",
                table: "ItemsVerificados",
                column: "ChecklistId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemsVerificados");

            migrationBuilder.DropTable(
                name: "ChecklistsServicio");
        }
    }
}
