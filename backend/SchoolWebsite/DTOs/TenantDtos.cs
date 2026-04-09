namespace SchoolWebsite.DTOs
{
    // Request DTOs
    public class CreateTenantDto
    {
        public string SchoolName { get; set; } = string.Empty;
        public string Subdomain { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string PrimaryColor { get; set; } = "#1B2A4A";
        public string AccentColor { get; set; } = "#C9A84C";
        public string? AboutText { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int? EstablishedYear { get; set; }
    }

    public class UpdateTenantDto
    {
        public string? SchoolName { get; set; }
        public string? LogoUrl { get; set; }
        public string? PrimaryColor { get; set; }
        public string? AccentColor { get; set; }
        public string? AboutText { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int? EstablishedYear { get; set; }
        public bool? IsActive { get; set; }
    }

    // Response DTOs
    public class TenantDto
    {
        public int Id { get; set; }
        public string SchoolName { get; set; } = string.Empty;
        public string Subdomain { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string PrimaryColor { get; set; } = "#1B2A4A";
        public string AccentColor { get; set; } = "#C9A84C";
        public string? AboutText { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int? EstablishedYear { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
