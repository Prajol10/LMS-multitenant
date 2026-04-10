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
    public class NoticeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NoticeController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/notice
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<NoticeDto>> CreateNotice(CreateNoticeDto createNoticeDto)
        {
            // Get tenantId from claims
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim) || !int.TryParse(tenantIdClaim, out int tenantId))
            {
                return Unauthorized("Invalid tenant");
            }

            var notice = new Notice
            {
                TenantId = tenantId,
                Title = createNoticeDto.Title,
                Content = createNoticeDto.Content,
                IsImportant = createNoticeDto.IsImportant
            };

            _context.Notices.Add(notice);
            await _context.SaveChangesAsync();

            var noticeDto = new NoticeDto
            {
                Id = notice.Id,
                Title = notice.Title,
                Content = notice.Content,
                IsImportant = notice.IsImportant,
                CreatedAt = notice.CreatedAt
            };

            return CreatedAtAction(nameof(GetNoticesByTenant), new { tenantId = tenantId }, noticeDto);
        }

        // GET: api/notice/{tenantId}
        [HttpGet("{tenantId}")]
        public async Task<ActionResult<IEnumerable<NoticeDto>>> GetNoticesByTenant(int tenantId)
        {
            var notices = await _context.Notices
                .Where(n => n.TenantId == tenantId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            var noticeDtos = notices.Select(n => new NoticeDto
            {
                Id = n.Id,
                Title = n.Title,
                Content = n.Content,
                IsImportant = n.IsImportant,
                CreatedAt = n.CreatedAt
            }).ToList();

            return Ok(noticeDtos);
        }

        // PUT: api/notice/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateNotice(int id, UpdateNoticeDto updateNoticeDto)
        {
            // Get tenantId from claims
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim) || !int.TryParse(tenantIdClaim, out int tenantId))
            {
                return Unauthorized("Invalid tenant");
            }

            var notice = await _context.Notices.FindAsync(id);
            if (notice == null)
            {
                return NotFound("Notice not found");
            }

            // Verify notice belongs to tenant
            if (notice.TenantId != tenantId)
            {
                return Forbid("You don't have permission to edit this notice");
            }

            notice.Title = updateNoticeDto.Title ?? notice.Title;
            notice.Content = updateNoticeDto.Content ?? notice.Content;
            notice.IsImportant = updateNoticeDto.IsImportant ?? notice.IsImportant;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/notice/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteNotice(int id)
        {
            // Get tenantId from claims
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim) || !int.TryParse(tenantIdClaim, out int tenantId))
            {
                return Unauthorized("Invalid tenant");
            }

            var notice = await _context.Notices.FindAsync(id);
            if (notice == null)
            {
                return NotFound("Notice not found");
            }

            // Verify notice belongs to tenant
            if (notice.TenantId != tenantId)
            {
                return Forbid("You don't have permission to delete this notice");
            }

            _context.Notices.Remove(notice);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
