using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolWebsite.Migrations
{
    /// <inheritdoc />
    public partial class AddMapEmbedUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MapEmbedUrl",
                table: "Tenants",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MapEmbedUrl",
                table: "Tenants");
        }
    }
}
