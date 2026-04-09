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

        // GET: api/school/{subdomain}
        [HttpGet("{subdomain}")]
        public async Task<ActionResult<TenantDto>> GetSchoolBySubdomain(string subdomain)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);

            if (tenant == null)
            {
                return NotFound("School not found");
            }

            var tenantDto = new TenantDto
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
                IsActive = tenant.IsActive,
                CreatedAt = tenant.CreatedAt
            };

            return Ok(tenantDto);
        }

        // POST: api/school
        [HttpPost]
        public async Task<ActionResult<TenantDto>> CreateSchool(CreateTenantDto createTenantDto)
        {
            // Check if subdomain already exists
            var existingTenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == createTenantDto.Subdomain.ToLower());

            if (existingTenant != null)
            {
                return BadRequest("Subdomain already exists");
            }

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

            var tenantDto = new TenantDto
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
                IsActive = tenant.IsActive,
                CreatedAt = tenant.CreatedAt
            };

            return CreatedAtAction(nameof(GetSchoolBySubdomain), new { subdomain = tenant.Subdomain }, tenantDto);
        }
    }
}
