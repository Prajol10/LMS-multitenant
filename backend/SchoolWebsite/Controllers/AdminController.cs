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
            var messages = await _context.ContactMessages.Where(m => m.TenantId == tenantId).OrderByDescending(m => m.CreatedAt).ToListAsync();
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
            var programs = await _context.SchoolPrograms.Where(p => p.TenantId == tenantId).OrderByDescending(p => p.CreatedAt).ToListAsync();
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

        [HttpGet("students")] [Authorize]
        public async Task<ActionResult> GetStudents()
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var students = await _context.Students.Where(s => s.TenantId == tenantId).OrderBy(s => s.Grade).ThenBy(s => s.Name).ToListAsync();
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
    public class StudentDto { public string Name { get; set; } = string.Empty; public string? Grade { get; set; } public string? Achievement { get; set; } public string? About { get; set; } public string? ImageUrl { get; set; } }
}
