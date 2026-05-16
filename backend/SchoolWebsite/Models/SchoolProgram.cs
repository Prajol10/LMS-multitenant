using System.ComponentModel.DataAnnotations;
namespace SchoolWebsite.Models
{
    public class SchoolProgram
    {
        public int Id { get; set; }
        [Required]
        public int TenantId { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Duration { get; set; }
        public string? Level { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsArchived { get; set; } = false;
        public DateTime? ArchivedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Tenant? Tenant { get; set; }
    }
}
