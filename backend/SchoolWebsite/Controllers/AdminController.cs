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

        [HttpGet("school")]
        [Authorize]
        public async Task<ActionResult<TenantDto>> GetOwnSchool()
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim) || !int.TryParse(tenantIdClaim, out int tenantId))
                return Unauthorized("Invalid tenant");

            var tenant = await _context.Tenants.FindAsync(tenantId);
            if (tenant == null) return NotFound("School not found");

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
                FacebookUrl = tenant.FacebookUrl,
                InstagramUrl = tenant.InstagramUrl,
                WebsiteUrl = tenant.WebsiteUrl,
                IsActive = tenant.IsActive,
                CreatedAt = tenant.CreatedAt
            });
        }

        [HttpPut("school")]
        [Authorize]
        public async Task<IActionResult> UpdateOwnSchool(UpdateTenantDto updateTenantDto)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim) || !int.TryParse(tenantIdClaim, out int tenantId))
                return Unauthorized("Invalid tenant");

            var tenant = await _context.Tenants.FindAsync(tenantId);
            if (tenant == null) return NotFound("School not found");

            tenant.SchoolName = updateTenantDto.SchoolName ?? tenant.SchoolName;
            tenant.LogoUrl = updateTenantDto.LogoUrl ?? tenant.LogoUrl;
            tenant.PrimaryColor = updateTenantDto.PrimaryColor ?? tenant.PrimaryColor;
            tenant.AccentColor = updateTenantDto.AccentColor ?? tenant.AccentColor;
            tenant.AboutText = updateTenantDto.AboutText ?? tenant.AboutText;
            tenant.Address = updateTenantDto.Address ?? tenant.Address;
            tenant.Phone = updateTenantDto.Phone ?? tenant.Phone;
            tenant.Email = updateTenantDto.Email ?? tenant.Email;
            tenant.EstablishedYear = updateTenantDto.EstablishedYear ?? tenant.EstablishedYear;
            tenant.FacebookUrl = updateTenantDto.FacebookUrl ?? tenant.FacebookUrl;
            tenant.InstagramUrl = updateTenantDto.InstagramUrl ?? tenant.InstagramUrl;
            tenant.WebsiteUrl = updateTenantDto.WebsiteUrl ?? tenant.WebsiteUrl;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
