using System.ComponentModel.DataAnnotations;

namespace SchoolWebsite.Models
{
    public class AdminUser
    {
        public int Id { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public string Role { get; set; } = "SchoolAdmin"; // "SuperAdmin" or "SchoolAdmin"
        
        public int? TenantId { get; set; } // Null for SuperAdmin, specific for SchoolAdmin
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime LastLoginAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public Tenant? Tenant { get; set; }
    }
}
