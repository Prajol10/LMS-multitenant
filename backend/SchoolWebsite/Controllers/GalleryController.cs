using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolWebsite.Data;
using SchoolWebsite.DTOs;
using SchoolWebsite.Models;

namespace SchoolWebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GalleryController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/school/{subdomain}/gallery
        [HttpGet("/api/school/{subdomain}/gallery")]
        public async Task<ActionResult<IEnumerable<GalleryImageDto>>> GetGalleryBySchool(string subdomain)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);

            if (tenant == null)
            {
                return NotFound("School not found");
            }

            var galleryImages = await _context.GalleryImages
                .Where(g => g.TenantId == tenant.Id)
                .OrderByDescending(g => g.CreatedAt)
                .ToListAsync();

            var galleryDtos = galleryImages.Select(g => new GalleryImageDto
            {
                Id = g.Id,
                ImageUrl = g.ImageUrl,
                Caption = g.Caption,
                CreatedAt = g.CreatedAt
            }).ToList();

            return Ok(galleryDtos);
        }

        // POST: api/school/{subdomain}/gallery
        [HttpPost("/api/school/{subdomain}/gallery")]
        public async Task<ActionResult<GalleryImageDto>> CreateGalleryImage(string subdomain, CreateGalleryImageDto createGalleryDto)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);

            if (tenant == null)
            {
                return NotFound("School not found");
            }

            var galleryImage = new GalleryImage
            {
                TenantId = tenant.Id,
                ImageUrl = createGalleryDto.ImageUrl,
                Caption = createGalleryDto.Caption
            };

            _context.GalleryImages.Add(galleryImage);
            await _context.SaveChangesAsync();

            var galleryDto = new GalleryImageDto
            {
                Id = galleryImage.Id,
                ImageUrl = galleryImage.ImageUrl,
                Caption = galleryImage.Caption,
                CreatedAt = galleryImage.CreatedAt
            };

            return CreatedAtAction(nameof(GetGalleryBySchool), new { subdomain = subdomain }, galleryDto);
        }
    }
}
