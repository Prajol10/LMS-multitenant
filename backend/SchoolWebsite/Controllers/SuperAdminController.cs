using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolWebsite.Data;
using SchoolWebsite.DTOs;
using SchoolWebsite.Models;
using System.Security.Cryptography;
using System.Text;

namespace SchoolWebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuperAdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SuperAdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("schools")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<IEnumerable<TenantDto>>> GetAllSchools()
        {
            var tenants = await _context.Tenants.OrderByDescending(t => t.CreatedAt).ToListAsync();
            return Ok(tenants.Select(MapToDto).ToList());
        }

        [HttpPost("schools")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<TenantDto>> CreateSchool(CreateTenantDto dto)
        {
            var existing = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == dto.Subdomain.ToLower());
            if (existing != null) return BadRequest("Subdomain already exists");

            var tenant = new Tenant
            {
                SchoolName = dto.SchoolName,
                Subdomain = dto.Subdomain.ToLower(),
                LogoUrl = dto.LogoUrl,
                BannerUrl = dto.BannerUrl,
                PrimaryColor = dto.PrimaryColor,
                AccentColor = dto.AccentColor,
                AboutText = dto.AboutText,
                Address = dto.Address,
                Phone = dto.Phone,
                Email = dto.Email,
                EstablishedYear = dto.EstablishedYear,
                FacebookUrl = dto.FacebookUrl,
                InstagramUrl = dto.InstagramUrl,
                WebsiteUrl = dto.WebsiteUrl,
                MapEmbedUrl = dto.MapEmbedUrl,
                VideoUrl = dto.VideoUrl,
                AboutImageUrl = dto.AboutImageUrl
            };
            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllSchools), MapToDto(tenant));
        }

        [HttpPut("schools/{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> UpdateSchool(int id, UpdateTenantDto dto)
        {
            var tenant = await _context.Tenants.FindAsync(id);
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
            tenant.IsActive = dto.IsActive ?? tenant.IsActive;
            tenant.FacebookUrl = dto.FacebookUrl ?? tenant.FacebookUrl;
            tenant.InstagramUrl = dto.InstagramUrl ?? tenant.InstagramUrl;
            tenant.WebsiteUrl = dto.WebsiteUrl ?? tenant.WebsiteUrl;
            tenant.MapEmbedUrl = dto.MapEmbedUrl ?? tenant.MapEmbedUrl;
            tenant.VideoUrl = dto.VideoUrl ?? tenant.VideoUrl;
            tenant.AboutImageUrl = dto.AboutImageUrl ?? tenant.AboutImageUrl;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("schools/{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> DeactivateSchool(int id)
        {
            var tenant = await _context.Tenants.FindAsync(id);
            if (tenant == null) return NotFound("School not found");
            tenant.IsActive = !tenant.IsActive;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("schools/{id}/admin")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<object>> CreateSchoolAdmin(int id, [FromBody] CreateAdminUserDto dto)
        {
            var tenant = await _context.Tenants.FindAsync(id);
            if (tenant == null) return NotFound("School not found");

            var existingEmail = await _context.AdminUsers
                .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (existingEmail != null) return BadRequest("An admin with this email already exists");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var adminUser = new AdminUser
            {
                Email = dto.Email,
                PasswordHash = passwordHash,
                Role = "SchoolAdmin",
                TenantId = id,
                IsActive = true
            };
            _context.AdminUsers.Add(adminUser);
            await _context.SaveChangesAsync();
            return Ok(new { message = "School admin created successfully" });
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

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }

    public class CreateAdminUserDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
