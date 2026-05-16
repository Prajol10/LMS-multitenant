using System.ComponentModel.DataAnnotations;
namespace SchoolWebsite.Models
{
    public class Notice
    {
        public int Id { get; set; }
        [Required]
        public int TenantId { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
        public bool IsImportant { get; set; } = false;
        public bool IsArchived { get; set; } = false;
        public DateTime? ArchivedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Tenant? Tenant { get; set; }
    }
}
