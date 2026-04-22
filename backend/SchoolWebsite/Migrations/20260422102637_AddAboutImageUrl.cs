using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolWebsite.Migrations
{
    /// <inheritdoc />
    public partial class AddAboutImageUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AboutImageUrl",
                table: "Tenants",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AboutImageUrl",
                table: "Tenants");
        }
    }
}
