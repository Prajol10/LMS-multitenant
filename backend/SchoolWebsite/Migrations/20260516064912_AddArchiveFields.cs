using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolWebsite.Migrations
{
    /// <inheritdoc />
    public partial class AddArchiveFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedAt",
                table: "Students",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "Students",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedAt",
                table: "SchoolPrograms",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "SchoolPrograms",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedAt",
                table: "Notices",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "Notices",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedAt",
                table: "LeadershipMessages",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "LeadershipMessages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedAt",
                table: "GalleryImages",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "GalleryImages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedAt",
                table: "CalendarEvents",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "CalendarEvents",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ArchivedAt",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "ArchivedAt",
                table: "SchoolPrograms");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "SchoolPrograms");

            migrationBuilder.DropColumn(
                name: "ArchivedAt",
                table: "Notices");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "Notices");

            migrationBuilder.DropColumn(
                name: "ArchivedAt",
                table: "LeadershipMessages");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "LeadershipMessages");

            migrationBuilder.DropColumn(
                name: "ArchivedAt",
                table: "GalleryImages");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "GalleryImages");

            migrationBuilder.DropColumn(
                name: "ArchivedAt",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "CalendarEvents");
        }
    }
}
