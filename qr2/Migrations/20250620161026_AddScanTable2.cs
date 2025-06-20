using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace qr2.Migrations
{
    /// <inheritdoc />
    public partial class AddScanTable2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Browser",
                table: "Scan",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Scan",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Scan",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Browser",
                table: "Scan");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Scan");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Scan");
        }
    }
}
