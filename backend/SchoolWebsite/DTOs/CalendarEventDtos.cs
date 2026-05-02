using System;

namespace SchoolWebsite.DTOs
{
    public class CalendarEventDto
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime EventDate { get; set; }
        public string? EventType { get; set; }
        public string? Location { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateCalendarEventDto
    {
        public int TenantId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime EventDate { get; set; }
        public string? EventType { get; set; }
        public string? Location { get; set; }
    }

    public class UpdateCalendarEventDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime EventDate { get; set; }
        public string? EventType { get; set; }
        public string? Location { get; set; }
    }
}
