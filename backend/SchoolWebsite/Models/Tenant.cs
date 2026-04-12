using System.ComponentModel.DataAnnotations;
namespace SchoolWebsite.Models
{
    public class Tenant
    {
        public int Id { get; set; }
        
        [Required]
        public string SchoolName { get; set; } = string.Empty;
        
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "Subdomain can only contain letters and numbers")]
        public string Subdomain { get; set; } = string.Empty;
        
        public string? LogoUrl { get; set; }
        
        [Required]
        public string PrimaryColor { get; set; } = "#1B2A4A";
        
        [Required]
        public string AccentColor { get; set; } = "#C9A84C";
        
        public string? AboutText { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int? EstablishedYear { get; set; }
        
        public string? FacebookUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
