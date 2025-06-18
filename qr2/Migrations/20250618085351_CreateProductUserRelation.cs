using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qr2.Migrations
{
    /// <inheritdoc />
    public partial class CreateProductUserRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserProduct_Product_ProductId",
                table: "UserProduct");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Product",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "QrContext",
                table: "UserProduct");

            migrationBuilder.DropColumn(
                name: "QrType",
                table: "UserProduct");

            migrationBuilder.RenameTable(
                name: "Product",
                newName: "Products");

            migrationBuilder.AddColumn<string>(
                name: "QrContext",
                table: "Products",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "QrType",
                table: "Products",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Products",
                table: "Products",
                column: "RecId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserProduct_Products_ProductId",
                table: "UserProduct",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "RecId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserProduct_Products_ProductId",
                table: "UserProduct");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Products",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "QrContext",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "QrType",
                table: "Products");

            migrationBuilder.RenameTable(
                name: "Products",
                newName: "Product");

            migrationBuilder.AddColumn<string>(
                name: "QrContext",
                table: "UserProduct",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "QrType",
                table: "UserProduct",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Product",
                table: "Product",
                column: "RecId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserProduct_Product_ProductId",
                table: "UserProduct",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "RecId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
