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
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AdminController(AppDbContext context) { _context = context; }

        private int? GetTenantId()
        {
            var claim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out int id)) return null;
            return id;
        }

        [HttpGet("school")] [Authorize]
        public async Task<ActionResult<TenantDto>> GetOwnSchool()
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized("Invalid tenant");
            var tenant = await _context.Tenants.FindAsync(tenantId);
            if (tenant == null) return NotFound("School not found");
            return Ok(MapToDto(tenant));
        }

        [HttpPut("school")] [Authorize]
        public async Task<IActionResult> UpdateOwnSchool(UpdateTenantDto dto)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized("Invalid tenant");
            var tenant = await _context.Tenants.FindAsync(tenantId);
            if (tenant == null) return NotFound("School not found");
            tenant.SchoolName = dto.SchoolName ?? tenant.SchoolName;
            tenant.LogoUrl = dto.LogoUrl ?? tenant.LogoUrl;
            tenant.BannerUrl = dto.BannerUrl ?? tenant.BannerUrl;
            tenant.PrimaryColor = dto.PrimaryColor ?? tenant.PrimaryColor;
            tenant.AccentColor = dto.AccentColor ?? tenant.AccentColor;
            tenant.AboutText = dto.AboutText ?? tenant.AboutText;
            tenant.Address = dto.Address ?? tenant.Address;
            tenant.Phone = dto.Phone ?? tenant.Phone;
            tenant.Email = dto.Email ?? tenant.Email;
            tenant.EstablishedYear = dto.EstablishedYear ?? tenant.EstablishedYear;
            tenant.FacebookUrl = dto.FacebookUrl ?? tenant.FacebookUrl;
            tenant.InstagramUrl = dto.InstagramUrl ?? tenant.InstagramUrl;
            tenant.WebsiteUrl = dto.WebsiteUrl ?? tenant.WebsiteUrl;
            tenant.MapEmbedUrl = dto.MapEmbedUrl ?? tenant.MapEmbedUrl;
            tenant.VideoUrl = dto.VideoUrl ?? tenant.VideoUrl;
            tenant.AboutImageUrl = dto.AboutImageUrl ?? tenant.AboutImageUrl;
            tenant.TotalStudents = dto.TotalStudents ?? tenant.TotalStudents;
            tenant.TotalTeachers = dto.TotalTeachers ?? tenant.TotalTeachers;
            tenant.TotalPrograms = dto.TotalPrograms ?? tenant.TotalPrograms;
            tenant.TotalStaff = dto.TotalStaff ?? tenant.TotalStaff;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("messages")] [Authorize]
        public async Task<ActionResult> GetMessages()
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var messages = await _context.ContactMessages.Where(m => m.TenantId == tenantId && !m.IsRead == m.IsRead).OrderByDescending(m => m.CreatedAt).ToListAsync();
            return Ok(messages);
        }

        [HttpPut("messages/{id}/read")] [Authorize]
        public async Task<IActionResult> MarkMessageRead(int id)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var msg = await _context.ContactMessages.FirstOrDefaultAsync(m => m.Id == id && m.TenantId == tenantId);
            if (msg == null) return NotFound();
            msg.IsRead = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("messages/{id}")] [Authorize]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var msg = await _context.ContactMessages.FirstOrDefaultAsync(m => m.Id == id && m.TenantId == tenantId);
            if (msg == null) return NotFound();
            _context.ContactMessages.Remove(msg);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("programs")] [Authorize]
        public async Task<ActionResult> GetPrograms()
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var programs = await _context.SchoolPrograms.Where(p => p.TenantId == tenantId && !p.IsArchived).OrderByDescending(p => p.CreatedAt).ToListAsync();
            return Ok(programs);
        }

        [HttpPost("programs")] [Authorize]
        public async Task<ActionResult> CreateProgram([FromBody] ProgramDto dto)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var program = new SchoolProgram { TenantId = tenantId.Value, Title = dto.Title, Description = dto.Description, Duration = dto.Duration, Level = dto.Level, ImageUrl = dto.ImageUrl, IsActive = true };
            _context.SchoolPrograms.Add(program);
            await _context.SaveChangesAsync();
            return Ok(program);
        }

        [HttpPut("programs/{id}")] [Authorize]
        public async Task<IActionResult> UpdateProgram(int id, [FromBody] ProgramDto dto)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var program = await _context.SchoolPrograms.FirstOrDefaultAsync(p => p.Id == id && p.TenantId == tenantId);
            if (program == null) return NotFound();
            program.Title = dto.Title ?? program.Title;
            program.Description = dto.Description ?? program.Description;
            program.Duration = dto.Duration ?? program.Duration;
            program.Level = dto.Level ?? program.Level;
            program.ImageUrl = dto.ImageUrl ?? program.ImageUrl;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("programs/{id}")] [Authorize]
        public async Task<IActionResult> DeleteProgram(int id)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var program = await _context.SchoolPrograms.FirstOrDefaultAsync(p => p.Id == id && p.TenantId == tenantId);
            if (program == null) return NotFound();
            _context.SchoolPrograms.Remove(program);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("leadership")] [Authorize]
        public async Task<ActionResult> GetLeadership()
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var msgs = await _context.LeadershipMessages.Where(m => m.TenantId == tenantId && !m.IsArchived).OrderBy(m => m.SortOrder).ToListAsync();
            return Ok(msgs);
        }

        [HttpPost("leadership")] [Authorize]
        public async Task<ActionResult> CreateLeadership([FromBody] LeadershipDto dto)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var msg = new LeadershipMessage { TenantId = tenantId.Value, Name = dto.Name, Title = dto.Title, Content = dto.Content, ImageUrl = dto.ImageUrl, SortOrder = dto.SortOrder, IsActive = true };
            _context.LeadershipMessages.Add(msg);
            await _context.SaveChangesAsync();
            return Ok(msg);
        }

        [HttpPut("leadership/{id}")] [Authorize]
        public async Task<IActionResult> UpdateLeadership(int id, [FromBody] LeadershipDto dto)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var msg = await _context.LeadershipMessages.FirstOrDefaultAsync(m => m.Id == id && m.TenantId == tenantId);
            if (msg == null) return NotFound();
            msg.Name = dto.Name ?? msg.Name;
            msg.Title = dto.Title ?? msg.Title;
            msg.Content = dto.Content ?? msg.Content;
            msg.ImageUrl = dto.ImageUrl ?? msg.ImageUrl;
            msg.SortOrder = dto.SortOrder;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("leadership/{id}")] [Authorize]
        public async Task<IActionResult> DeleteLeadership(int id)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var msg = await _context.LeadershipMessages.FirstOrDefaultAsync(m => m.Id == id && m.TenantId == tenantId);
            if (msg == null) return NotFound();
            _context.LeadershipMessages.Remove(msg);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("students")] [Authorize]
        public async Task<ActionResult> GetStudents()
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var students = await _context.Students.Where(s => s.TenantId == tenantId && !s.IsArchived).OrderBy(s => s.Grade).ThenBy(s => s.Name).ToListAsync();
            return Ok(students);
        }

        [HttpPost("students")] [Authorize]
        public async Task<ActionResult> CreateStudent([FromBody] StudentDto dto)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var student = new Student { TenantId = tenantId.Value, Name = dto.Name, Grade = dto.Grade, Achievement = dto.Achievement, About = dto.About, ImageUrl = dto.ImageUrl, IsActive = true };
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            return Ok(student);
        }

        [HttpPut("students/{id}")] [Authorize]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] StudentDto dto)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == id && s.TenantId == tenantId);
            if (student == null) return NotFound();
            student.Name = dto.Name ?? student.Name;
            student.Grade = dto.Grade ?? student.Grade;
            student.Achievement = dto.Achievement ?? student.Achievement;
            student.About = dto.About ?? student.About;
            student.ImageUrl = dto.ImageUrl ?? student.ImageUrl;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("students/{id}")] [Authorize]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == id && s.TenantId == tenantId);
            if (student == null) return NotFound();
            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        // ─── ARCHIVE ────────────────────────────────────────────────────

        [HttpGet("archive")] [Authorize]
        public async Task<ActionResult> GetArchive()
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();

            var notices = await _context.Notices.Where(n => n.TenantId == tenantId && n.IsArchived).OrderByDescending(n => n.ArchivedAt).Select(n => new { type = "notice", n.Id, title = n.Title, description = n.Content, n.ArchivedAt, n.CreatedAt }).ToListAsync();
            var gallery = await _context.GalleryImages.Where(g => g.TenantId == tenantId && g.IsArchived).OrderByDescending(g => g.ArchivedAt).Select(g => new { type = "gallery", g.Id, title = g.Caption ?? "Gallery Image", description = g.ImageUrl, g.ArchivedAt, g.CreatedAt }).ToListAsync();
            var programs = await _context.SchoolPrograms.Where(p => p.TenantId == tenantId && p.IsArchived).OrderByDescending(p => p.ArchivedAt).Select(p => new { type = "program", p.Id, title = p.Title, description = p.Description, p.ArchivedAt, p.CreatedAt }).ToListAsync();
            var students = await _context.Students.Where(s => s.TenantId == tenantId && s.IsArchived).OrderByDescending(s => s.ArchivedAt).Select(s => new { type = "student", s.Id, title = s.Name, description = s.Grade, s.ArchivedAt, s.CreatedAt }).ToListAsync();
            var leadership = await _context.LeadershipMessages.Where(l => l.TenantId == tenantId && l.IsArchived).OrderByDescending(l => l.ArchivedAt).Select(l => new { type = "leadership", l.Id, title = l.Name, description = l.Title, l.ArchivedAt, l.CreatedAt }).ToListAsync();
            var calendar = await _context.CalendarEvents.Where(c => c.TenantId == tenantId && c.IsArchived).OrderByDescending(c => c.ArchivedAt).Select(c => new { type = "calendar", c.Id, title = c.Title, description = c.Description, c.ArchivedAt, c.CreatedAt }).ToListAsync();

            var all = notices.Cast<object>().Concat(gallery).Concat(programs).Concat(students).Concat(leadership).Concat(calendar).OrderByDescending(x => ((dynamic)x).ArchivedAt).ToList();
            return Ok(all);
        }

        [HttpPut("archive/{type}/{id}")] [Authorize]
        public async Task<IActionResult> ArchiveItem(string type, int id)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var now = DateTime.UtcNow;

            switch (type.ToLower())
            {
                case "notice":
                    var notice = await _context.Notices.FirstOrDefaultAsync(n => n.Id == id && n.TenantId == tenantId);
                    if (notice == null) return NotFound();
                    notice.IsArchived = true; notice.ArchivedAt = now; break;
                case "gallery":
                    var gallery = await _context.GalleryImages.FirstOrDefaultAsync(g => g.Id == id && g.TenantId == tenantId);
                    if (gallery == null) return NotFound();
                    gallery.IsArchived = true; gallery.ArchivedAt = now; break;
                case "program":
                    var program = await _context.SchoolPrograms.FirstOrDefaultAsync(p => p.Id == id && p.TenantId == tenantId);
                    if (program == null) return NotFound();
                    program.IsArchived = true; program.ArchivedAt = now; break;
                case "student":
                    var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == id && s.TenantId == tenantId);
                    if (student == null) return NotFound();
                    student.IsArchived = true; student.ArchivedAt = now; break;
                case "leadership":
                    var leadership = await _context.LeadershipMessages.FirstOrDefaultAsync(l => l.Id == id && l.TenantId == tenantId);
                    if (leadership == null) return NotFound();
                    leadership.IsArchived = true; leadership.ArchivedAt = now; break;
                case "calendar":
                    var calendar = await _context.CalendarEvents.FirstOrDefaultAsync(c => c.Id == id && c.TenantId == tenantId);
                    if (calendar == null) return NotFound();
                    calendar.IsArchived = true; calendar.ArchivedAt = now; break;
                default: return BadRequest("Unknown type");
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("restore/{type}/{id}")] [Authorize]
        public async Task<IActionResult> RestoreItem(string type, int id)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();

            switch (type.ToLower())
            {
                case "notice":
                    var notice = await _context.Notices.FirstOrDefaultAsync(n => n.Id == id && n.TenantId == tenantId);
                    if (notice == null) return NotFound();
                    notice.IsArchived = false; notice.ArchivedAt = null; break;
                case "gallery":
                    var gallery = await _context.GalleryImages.FirstOrDefaultAsync(g => g.Id == id && g.TenantId == tenantId);
                    if (gallery == null) return NotFound();
                    gallery.IsArchived = false; gallery.ArchivedAt = null; break;
                case "program":
                    var program = await _context.SchoolPrograms.FirstOrDefaultAsync(p => p.Id == id && p.TenantId == tenantId);
                    if (program == null) return NotFound();
                    program.IsArchived = false; program.ArchivedAt = null; break;
                case "student":
                    var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == id && s.TenantId == tenantId);
                    if (student == null) return NotFound();
                    student.IsArchived = false; student.ArchivedAt = null; break;
                case "leadership":
                    var leadership = await _context.LeadershipMessages.FirstOrDefaultAsync(l => l.Id == id && l.TenantId == tenantId);
                    if (leadership == null) return NotFound();
                    leadership.IsArchived = false; leadership.ArchivedAt = null; break;
                case "calendar":
                    var calendar = await _context.CalendarEvents.FirstOrDefaultAsync(c => c.Id == id && c.TenantId == tenantId);
                    if (calendar == null) return NotFound();
                    calendar.IsArchived = false; calendar.ArchivedAt = null; break;
                default: return BadRequest("Unknown type");
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }
        private static TenantDto MapToDto(Tenant t) => new()
        {
            Id = t.Id, SchoolName = t.SchoolName, Subdomain = t.Subdomain,
            LogoUrl = t.LogoUrl, BannerUrl = t.BannerUrl, PrimaryColor = t.PrimaryColor,
            AccentColor = t.AccentColor, AboutText = t.AboutText, Address = t.Address,
            Phone = t.Phone, Email = t.Email, EstablishedYear = t.EstablishedYear,
            FacebookUrl = t.FacebookUrl, InstagramUrl = t.InstagramUrl, WebsiteUrl = t.WebsiteUrl,
            MapEmbedUrl = t.MapEmbedUrl, VideoUrl = t.VideoUrl, AboutImageUrl = t.AboutImageUrl,
            IsActive = t.IsActive, CreatedAt = t.CreatedAt
        };
    }

    public class ProgramDto { public string Title { get; set; } = string.Empty; public string? Description { get; set; } public string? Duration { get; set; } public string? Level { get; set; } public string? ImageUrl { get; set; } }
    public class LeadershipDto { public string Name { get; set; } = string.Empty; public string? Title { get; set; } public string? Content { get; set; } public string? ImageUrl { get; set; } public int SortOrder { get; set; } = 0; }
    public class StudentDto { public string Name { get; set; } = string.Empty; public string? Grade { get; set; } public string? Achievement { get; set; } public string? About { get; set; } public string? ImageUrl { get; set; } }
}
