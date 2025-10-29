using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RetoCruzRoja.Migrations
{
    /// <inheritdoc />
    public partial class AddChecklistTablesFinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventariosBase_ItemsInventario_ItemInventarioId",
                table: "InventariosBase");

            migrationBuilder.RenameColumn(
                name: "ItemInventarioId",
                table: "InventariosBase",
                newName: "ItemId");

            migrationBuilder.RenameIndex(
                name: "IX_InventariosBase_ItemInventarioId",
                table: "InventariosBase",
                newName: "IX_InventariosBase_ItemId");

            migrationBuilder.RenameIndex(
                name: "IX_InventariosBase_AmbulanciaId_ItemInventarioId",
                table: "InventariosBase",
                newName: "IX_InventariosBase_AmbulanciaId_ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventariosBase_ItemsInventario_ItemId",
                table: "InventariosBase",
                column: "ItemId",
                principalTable: "ItemsInventario",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventariosBase_ItemsInventario_ItemId",
                table: "InventariosBase");

            migrationBuilder.RenameColumn(
                name: "ItemId",
                table: "InventariosBase",
                newName: "ItemInventarioId");

            migrationBuilder.RenameIndex(
                name: "IX_InventariosBase_ItemId",
                table: "InventariosBase",
                newName: "IX_InventariosBase_ItemInventarioId");

            migrationBuilder.RenameIndex(
                name: "IX_InventariosBase_AmbulanciaId_ItemId",
                table: "InventariosBase",
                newName: "IX_InventariosBase_AmbulanciaId_ItemInventarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventariosBase_ItemsInventario_ItemInventarioId",
                table: "InventariosBase",
                column: "ItemInventarioId",
                principalTable: "ItemsInventario",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
