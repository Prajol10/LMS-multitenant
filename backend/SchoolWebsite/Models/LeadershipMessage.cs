using System.ComponentModel.DataAnnotations;
namespace SchoolWebsite.Models
{
    public class LeadershipMessage
    {
        public int Id { get; set; }
        [Required]
        public int TenantId { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? ImageUrl { get; set; }
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public bool IsArchived { get; set; } = false;
        public DateTime? ArchivedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Tenant? Tenant { get; set; }
    }
}
