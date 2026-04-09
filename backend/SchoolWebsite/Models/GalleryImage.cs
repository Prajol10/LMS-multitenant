using System.ComponentModel.DataAnnotations;

namespace SchoolWebsite.Models
{
    public class GalleryImage
    {
        public int Id { get; set; }
        
        [Required]
        public int TenantId { get; set; }
        
        [Required]
        public string ImageUrl { get; set; } = string.Empty;
        
        public string? Caption { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public Tenant? Tenant { get; set; }
    }
}
