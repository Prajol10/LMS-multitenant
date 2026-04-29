using System.ComponentModel.DataAnnotations;
namespace SchoolWebsite.Models
{
    public class Student
    {
        public int Id { get; set; }

        [Required]
        public int TenantId { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Grade { get; set; }
        public string? Achievement { get; set; }
        public string? About { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Tenant? Tenant { get; set; }
    }
}
