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

        [HttpGet("{subdomain}")]
        public async Task<ActionResult<TenantDto>> GetSchoolBySubdomain(string subdomain)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);

            if (tenant == null)
                return NotFound("School not found");

            return Ok(new TenantDto
            {
                Id = tenant.Id,
                SchoolName = tenant.SchoolName,
                Subdomain = tenant.Subdomain,
                LogoUrl = tenant.LogoUrl,
                PrimaryColor = tenant.PrimaryColor,
                AccentColor = tenant.AccentColor,
                AboutText = tenant.AboutText,
                Address = tenant.Address,
                Phone = tenant.Phone,
                Email = tenant.Email,
                EstablishedYear = tenant.EstablishedYear,
                MapEmbedUrl = tenant.MapEmbedUrl,
                FacebookUrl = tenant.FacebookUrl,
                InstagramUrl = tenant.InstagramUrl,
                WebsiteUrl = tenant.WebsiteUrl,
                IsActive = tenant.IsActive,
                CreatedAt = tenant.CreatedAt
            });
        }

        [HttpGet("{subdomain}/notices")]
        public async Task<ActionResult> GetNoticesBySubdomain(string subdomain)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);

            if (tenant == null)
                return NotFound("School not found");

            var notices = await _context.Notices
                .Where(n => n.TenantId == tenant.Id)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new
                {
                    n.Id,
                    n.Title,
                    n.Content,
                    n.IsImportant,
                    n.CreatedAt
                })
                .ToListAsync();

            return Ok(notices);
        }

        [HttpGet("{subdomain}/gallery")]
        public async Task<ActionResult> GetGalleryBySubdomain(string subdomain)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);

            if (tenant == null)
                return NotFound("School not found");

            var gallery = await _context.GalleryImages
                .Where(g => g.TenantId == tenant.Id)
                .OrderByDescending(g => g.CreatedAt)
                .Select(g => new
                {
                    g.Id,
                    g.ImageUrl,
                    g.Caption,
                    g.CreatedAt
                })
                .ToListAsync();

            return Ok(gallery);
        }

        [HttpPost]
        public async Task<ActionResult<TenantDto>> CreateSchool(CreateTenantDto createTenantDto)
        {
            var existingTenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == createTenantDto.Subdomain.ToLower());

            if (existingTenant != null)
                return BadRequest("Subdomain already exists");

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
                Id = tenant.Id,
                SchoolName = tenant.SchoolName,
                Subdomain = tenant.Subdomain,
                LogoUrl = tenant.LogoUrl,
                PrimaryColor = tenant.PrimaryColor,
                AccentColor = tenant.AccentColor,
                AboutText = tenant.AboutText,
                Address = tenant.Address,
                Phone = tenant.Phone,
                Email = tenant.Email,
                EstablishedYear = tenant.EstablishedYear,
                MapEmbedUrl = tenant.MapEmbedUrl,
                FacebookUrl = tenant.FacebookUrl,
                InstagramUrl = tenant.InstagramUrl,
                WebsiteUrl = tenant.WebsiteUrl,
                IsActive = tenant.IsActive,
                CreatedAt = tenant.CreatedAt
            });
        }
    }
}
