namespace SchoolWebsite.DTOs
{
    // Request DTOs
    public class CreateGalleryImageDto
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
    }

    public class UpdateGalleryImageDto
    {
        public string? ImageUrl { get; set; }
        public string? Caption { get; set; }
    }

    // Response DTOs
    public class GalleryImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
