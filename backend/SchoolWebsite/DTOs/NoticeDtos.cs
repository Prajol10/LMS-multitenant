namespace SchoolWebsite.DTOs
{
    // Request DTOs
    public class CreateNoticeDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
        public bool IsImportant { get; set; } = false;
    }

    public class UpdateNoticeDto
    {
        public string? Title { get; set; }
        public string? Content { get; set; }
        public bool? IsImportant { get; set; }
    }

    // Response DTOs
    public class NoticeDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
        public bool IsImportant { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
