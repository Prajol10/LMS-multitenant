using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolWebsite.Data;
using SchoolWebsite.DTOs;
using SchoolWebsite.Models;

namespace SchoolWebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CalendarEventController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CalendarEventController(AppDbContext context) { _context = context; }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<CalendarEventDto>> Create(CreateCalendarEventDto dto)
        {
            var ev = new CalendarEvent
            {
                TenantId = dto.TenantId,
                Title = dto.Title,
                Description = dto.Description,
                EventDate = dto.EventDate,
                EventEndDate = dto.EventEndDate,
                EventType = dto.EventType,
                Location = dto.Location,
                CreatedAt = DateTime.UtcNow
            };
            _context.CalendarEvents.Add(ev);
            await _context.SaveChangesAsync();
            return Ok(MapToDto(ev));
        }

        [HttpGet("tenant/{tenantId}")]
        public async Task<ActionResult<IEnumerable<CalendarEventDto>>> GetByTenant(int tenantId)
        {
            var events = await _context.CalendarEvents
                .Where(e => e.TenantId == tenantId)
                .OrderBy(e => e.EventDate)
                .ToListAsync();
            return Ok(events.Select(MapToDto).ToList());
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, UpdateCalendarEventDto dto)
        {
            var ev = await _context.CalendarEvents.FindAsync(id);
            if (ev == null) return NotFound();
            ev.Title = dto.Title;
            ev.Description = dto.Description;
            ev.EventDate = dto.EventDate;
            ev.EventEndDate = dto.EventEndDate;
            ev.EventType = dto.EventType;
            ev.Location = dto.Location;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var ev = await _context.CalendarEvents.FindAsync(id);
            if (ev == null) return NotFound();
            _context.CalendarEvents.Remove(ev);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private static CalendarEventDto MapToDto(CalendarEvent e) => new()
        {
            Id = e.Id,
            TenantId = e.TenantId,
            Title = e.Title,
            Description = e.Description,
            EventDate = e.EventDate,
            EventEndDate = e.EventEndDate,
            EventType = e.EventType,
            Location = e.Location,
            CreatedAt = e.CreatedAt
        };
    }
}
