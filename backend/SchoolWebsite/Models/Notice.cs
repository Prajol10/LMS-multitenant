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
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public Tenant? Tenant { get; set; }
    }
}
