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

        // GET: api/superadmin/schools
        [HttpGet("schools")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<IEnumerable<TenantDto>>> GetAllSchools()
        {
            var tenants = await _context.Tenants
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            var tenantDtos = tenants.Select(tenant => new TenantDto
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
            }).ToList();

            return Ok(tenantDtos);
        }

        // POST: api/superadmin/schools
        [HttpPost("schools")]
        [Authorize(Roles = "SuperAdmin")]
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

            return CreatedAtAction(nameof(GetAllSchools), tenantDto);
        }

        // PUT: api/superadmin/schools/{id}
        [HttpPut("schools/{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> UpdateSchool(int id, UpdateTenantDto updateTenantDto)
        {
            var tenant = await _context.Tenants.FindAsync(id);
            if (tenant == null)
            {
                return NotFound("School not found");
            }

            tenant.SchoolName = updateTenantDto.SchoolName ?? tenant.SchoolName;
            tenant.LogoUrl = updateTenantDto.LogoUrl ?? tenant.LogoUrl;
            tenant.PrimaryColor = updateTenantDto.PrimaryColor ?? tenant.PrimaryColor;
            tenant.AccentColor = updateTenantDto.AccentColor ?? tenant.AccentColor;
            tenant.AboutText = updateTenantDto.AboutText ?? tenant.AboutText;
            tenant.Address = updateTenantDto.Address ?? tenant.Address;
            tenant.Phone = updateTenantDto.Phone ?? tenant.Phone;
            tenant.Email = updateTenantDto.Email ?? tenant.Email;
            tenant.EstablishedYear = updateTenantDto.EstablishedYear ?? tenant.EstablishedYear;
            tenant.IsActive = updateTenantDto.IsActive ?? tenant.IsActive;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/superadmin/schools/{id}
        [HttpDelete("schools/{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> DeactivateSchool(int id)
        {
            var tenant = await _context.Tenants.FindAsync(id);
            if (tenant == null)
            {
                return NotFound("School not found");
            }

            tenant.IsActive = !tenant.IsActive;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/superadmin/schools/{id}/admin
        [HttpPost("schools/{id}/admin")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<object>> CreateSchoolAdmin(int id, [FromBody] CreateAdminUserDto createAdminDto)
        {
            var tenant = await _context.Tenants.FindAsync(id);
            if (tenant == null)
            {
                return NotFound("School not found");
            }

            // Check if email already exists (prevent duplicate emails, but allow multiple admins)
            var existingEmail = await _context.AdminUsers
                .FirstOrDefaultAsync(u => u.Email == createAdminDto.Email);

            if (existingEmail != null)
            {
                return BadRequest("Email already in use");
            }

            // Hash password
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(createAdminDto.Password);

            var adminUser = new AdminUser
            {
                Email = createAdminDto.Email,
                PasswordHash = passwordHash,
                Role = "SchoolAdmin",
                TenantId = id,
                IsActive = true
            };

            _context.AdminUsers.Add(adminUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "School admin created successfully", adminId = adminUser.Id });
        }

        // Helper method to hash password
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }

    // DTO for creating admin user
    public class CreateAdminUserDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
