using System.ComponentModel.DataAnnotations;
namespace SchoolWebsite.Models
{
    public class ContactMessage
    {
        public int Id { get; set; }

        [Required]
        public int TenantId { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Tenant? Tenant { get; set; }
    }
}
