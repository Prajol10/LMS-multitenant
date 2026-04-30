using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolWebsite.Data;
using SchoolWebsite.DTOs;
using SchoolWebsite.Models;

namespace SchoolWebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchoolController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SchoolController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<ActionResult> GetAllPublic()
        {
            var schools = await _context.Tenants
                .Where(t => t.IsActive)
                .OrderBy(t => t.SchoolName)
                .Select(t => new
                {
                    t.Id, t.SchoolName, t.Subdomain,
                    t.PrimaryColor, t.AccentColor, t.LogoUrl, t.EstablishedYear
                })
                .ToListAsync();
            return Ok(schools);
        }

        [HttpGet("{subdomain}")]
        public async Task<ActionResult<TenantDto>> GetSchoolBySubdomain(string subdomain)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);
            if (tenant == null) return NotFound("School not found");

            return Ok(new TenantDto
            {
                Id = tenant.Id, SchoolName = tenant.SchoolName, Subdomain = tenant.Subdomain,
                LogoUrl = tenant.LogoUrl, BannerUrl = tenant.BannerUrl,
                PrimaryColor = tenant.PrimaryColor, AccentColor = tenant.AccentColor,
                AboutText = tenant.AboutText, Address = tenant.Address, Phone = tenant.Phone,
                Email = tenant.Email, EstablishedYear = tenant.EstablishedYear,
                MapEmbedUrl = tenant.MapEmbedUrl, VideoUrl = tenant.VideoUrl,
                AboutImageUrl = tenant.AboutImageUrl, FacebookUrl = tenant.FacebookUrl,
                InstagramUrl = tenant.InstagramUrl, WebsiteUrl = tenant.WebsiteUrl,
                IsActive = tenant.IsActive, CreatedAt = tenant.CreatedAt
            });
        }

        [HttpGet("{subdomain}/notices")]
        public async Task<ActionResult> GetNoticesBySubdomain(string subdomain)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);
            if (tenant == null) return NotFound("School not found");

            var notices = await _context.Notices
                .Where(n => n.TenantId == tenant.Id)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new { n.Id, n.Title, n.Content, n.IsImportant, n.CreatedAt })
                .ToListAsync();
            return Ok(notices);
        }

        [HttpGet("{subdomain}/gallery")]
        public async Task<ActionResult> GetGalleryBySubdomain(string subdomain)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);
            if (tenant == null) return NotFound("School not found");

            var gallery = await _context.GalleryImages
                .Where(g => g.TenantId == tenant.Id)
                .OrderByDescending(g => g.CreatedAt)
                .Select(g => new { g.Id, g.ImageUrl, g.Caption, g.CreatedAt })
                .ToListAsync();
            return Ok(gallery);
        }

        [HttpGet("{subdomain}/programs")]
        public async Task<ActionResult> GetProgramsBySubdomain(string subdomain)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);
            if (tenant == null) return NotFound("School not found");

            var programs = await _context.SchoolPrograms
                .Where(p => p.TenantId == tenant.Id && p.IsActive)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new { p.Id, p.Title, p.Description, p.Duration, p.Level, p.ImageUrl, p.CreatedAt })
                .ToListAsync();
            return Ok(programs);
        }

        [HttpGet("{subdomain}/students")]
        public async Task<ActionResult> GetStudentsBySubdomain(string subdomain)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);
            if (tenant == null) return NotFound("School not found");

            var students = await _context.Students
                .Where(s => s.TenantId == tenant.Id && s.IsActive)
                .OrderBy(s => s.Grade).ThenBy(s => s.Name)
                .Select(s => new { s.Id, s.Name, s.Grade, s.Achievement, s.ImageUrl, s.CreatedAt })
                .ToListAsync();
            return Ok(students);
        }

        [HttpGet("{subdomain}/messages")]
        public async Task<ActionResult> GetMessagesBySubdomain(string subdomain)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);
            if (tenant == null) return NotFound("School not found");

            var messages = await _context.LeadershipMessages
                .Where(m => m.TenantId == tenant.Id && m.IsActive)
                .OrderBy(m => m.SortOrder)
                .ThenBy(m => m.CreatedAt)
                .Select(m => new { m.Id, m.Name, m.Title, m.Content, m.ImageUrl, m.SortOrder })
                .ToListAsync();
            return Ok(messages);
        }

        [HttpPost("{subdomain}/contact")]
        public async Task<IActionResult> SubmitContact(string subdomain, [FromBody] ContactMessageDto dto)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);
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

        [HttpPost]
        public async Task<ActionResult<TenantDto>> CreateSchool(CreateTenantDto createTenantDto)
        {
            var existingTenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == createTenantDto.Subdomain.ToLower());
            if (existingTenant != null) return BadRequest("Subdomain already exists");

            var tenant = new Tenant
            {
                SchoolName = createTenantDto.SchoolName,
                Subdomain = createTenantDto.Subdomain.ToLower(),
                LogoUrl = createTenantDto.LogoUrl,
                PrimaryColor = createTenantDto.PrimaryColor,
                AccentColor = createTenantDto.AccentColor,
                AboutText = createTenantDto.AboutText,
                Address = createTenantDto.Address,
                Phone = createTenantDto.Phone,
                Email = createTenantDto.Email,
                EstablishedYear = createTenantDto.EstablishedYear
            };
            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSchoolBySubdomain), new { subdomain = tenant.Subdomain }, new TenantDto
            {
                Id = tenant.Id, SchoolName = tenant.SchoolName, Subdomain = tenant.Subdomain,
                LogoUrl = tenant.LogoUrl, PrimaryColor = tenant.PrimaryColor, AccentColor = tenant.AccentColor,
                AboutText = tenant.AboutText, Address = tenant.Address, Phone = tenant.Phone,
                Email = tenant.Email, EstablishedYear = tenant.EstablishedYear,
                IsActive = tenant.IsActive, CreatedAt = tenant.CreatedAt
            });
        }
    }

    public class ContactMessageDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
