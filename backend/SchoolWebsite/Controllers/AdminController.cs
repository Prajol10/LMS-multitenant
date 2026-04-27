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

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        private int? GetTenantId()
        {
            var claim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out int id)) return null;
            return id;
        }

        [HttpGet("school")]
        [Authorize]
        public async Task<ActionResult<TenantDto>> GetOwnSchool()
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized("Invalid tenant");
            var tenant = await _context.Tenants.FindAsync(tenantId);
            if (tenant == null) return NotFound("School not found");
            return Ok(MapToDto(tenant));
        }

        [HttpPut("school")]
        [Authorize]
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

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("messages")]
        [Authorize]
        public async Task<ActionResult> GetMessages()
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var messages = await _context.ContactMessages
                .Where(m => m.TenantId == tenantId)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
            return Ok(messages);
        }

        [HttpPut("messages/{id}/read")]
        [Authorize]
        public async Task<IActionResult> MarkMessageRead(int id)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var msg = await _context.ContactMessages
                .FirstOrDefaultAsync(m => m.Id == id && m.TenantId == tenantId);
            if (msg == null) return NotFound();
            msg.IsRead = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("messages/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var msg = await _context.ContactMessages
                .FirstOrDefaultAsync(m => m.Id == id && m.TenantId == tenantId);
            if (msg == null) return NotFound();
            _context.ContactMessages.Remove(msg);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("programs")]
        [Authorize]
        public async Task<ActionResult> GetPrograms()
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var programs = await _context.SchoolPrograms
                .Where(p => p.TenantId == tenantId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
            return Ok(programs);
        }

        [HttpPost("programs")]
        [Authorize]
        public async Task<ActionResult> CreateProgram([FromBody] ProgramDto dto)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var program = new SchoolProgram
            {
                TenantId = tenantId.Value,
                Title = dto.Title,
                Description = dto.Description,
                Duration = dto.Duration,
                Level = dto.Level,
                ImageUrl = dto.ImageUrl,
                IsActive = true
            };
            _context.SchoolPrograms.Add(program);
            await _context.SaveChangesAsync();
            return Ok(program);
        }

        [HttpPut("programs/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProgram(int id, [FromBody] ProgramDto dto)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var program = await _context.SchoolPrograms
                .FirstOrDefaultAsync(p => p.Id == id && p.TenantId == tenantId);
            if (program == null) return NotFound();
            program.Title = dto.Title ?? program.Title;
            program.Description = dto.Description ?? program.Description;
            program.Duration = dto.Duration ?? program.Duration;
            program.Level = dto.Level ?? program.Level;
            program.ImageUrl = dto.ImageUrl ?? program.ImageUrl;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("programs/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProgram(int id)
        {
            var tenantId = GetTenantId();
            if (tenantId == null) return Unauthorized();
            var program = await _context.SchoolPrograms
                .FirstOrDefaultAsync(p => p.Id == id && p.TenantId == tenantId);
            if (program == null) return NotFound();
            _context.SchoolPrograms.Remove(program);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("contact/{subdomain}")]
        public async Task<IActionResult> SubmitContact(string subdomain, [FromBody] ContactMessageDto dto)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower());
            if (tenant == null) return NotFound("School not found");
            var message = new ContactMessage
            {
                TenantId = tenant.Id,
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Message = dto.Message
            };
            _context.ContactMessages.Add(message);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Message sent successfully!" });
        }

        private static TenantDto MapToDto(Tenant t) => new()
        {
            Id = t.Id,
            SchoolName = t.SchoolName,
            Subdomain = t.Subdomain,
            LogoUrl = t.LogoUrl,
            BannerUrl = t.BannerUrl,
            PrimaryColor = t.PrimaryColor,
            AccentColor = t.AccentColor,
            AboutText = t.AboutText,
            Address = t.Address,
            Phone = t.Phone,
            Email = t.Email,
            EstablishedYear = t.EstablishedYear,
            FacebookUrl = t.FacebookUrl,
            InstagramUrl = t.InstagramUrl,
            WebsiteUrl = t.WebsiteUrl,
            MapEmbedUrl = t.MapEmbedUrl,
            VideoUrl = t.VideoUrl,
            AboutImageUrl = t.AboutImageUrl,
            IsActive = t.IsActive,
            CreatedAt = t.CreatedAt
        };
    }

    public class ProgramDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Duration { get; set; }
        public string? Level { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class ContactMessageDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
