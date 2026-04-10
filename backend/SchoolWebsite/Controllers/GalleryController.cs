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
    public class GalleryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GalleryController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/gallery
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<GalleryImageDto>> CreateGalleryImage(CreateGalleryImageDto createGalleryDto)
        {
            // Get tenantId from claims
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim) || !int.TryParse(tenantIdClaim, out int tenantId))
            {
                return Unauthorized("Invalid tenant");
            }

            var galleryImage = new GalleryImage
            {
                TenantId = tenantId,
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

            return CreatedAtAction(nameof(GetGalleryByTenant), new { tenantId = tenantId }, galleryDto);
        }

        // GET: api/gallery/{tenantId}
        [HttpGet("{tenantId}")]
        public async Task<ActionResult<IEnumerable<GalleryImageDto>>> GetGalleryByTenant(int tenantId)
        {
            var galleryImages = await _context.GalleryImages
                .Where(g => g.TenantId == tenantId)
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

        // DELETE: api/gallery/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteGalleryImage(int id)
        {
            // Get tenantId from claims
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim) || !int.TryParse(tenantIdClaim, out int tenantId))
            {
                return Unauthorized("Invalid tenant");
            }

            var galleryImage = await _context.GalleryImages.FindAsync(id);
            if (galleryImage == null)
            {
                return NotFound("Gallery image not found");
            }

            // Verify image belongs to tenant
            if (galleryImage.TenantId != tenantId)
            {
                return Forbid("You don't have permission to delete this image");
            }

            _context.GalleryImages.Remove(galleryImage);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
