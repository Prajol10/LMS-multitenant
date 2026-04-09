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

        // GET: api/school/{subdomain}/notices
        [HttpGet("/api/school/{subdomain}/notices")]
        public async Task<ActionResult<IEnumerable<NoticeDto>>> GetNoticesBySchool(string subdomain)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);

            if (tenant == null)
            {
                return NotFound("School not found");
            }

            var notices = await _context.Notices
                .Where(n => n.TenantId == tenant.Id)
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

        // POST: api/school/{subdomain}/notice
        [HttpPost("/api/school/{subdomain}/notice")]
        public async Task<ActionResult<NoticeDto>> CreateNotice(string subdomain, CreateNoticeDto createNoticeDto)
        {
            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain.ToLower() == subdomain.ToLower() && t.IsActive);

            if (tenant == null)
            {
                return NotFound("School not found");
            }

            var notice = new Notice
            {
                TenantId = tenant.Id,
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

            return CreatedAtAction(nameof(GetNoticesBySchool), new { subdomain = subdomain }, noticeDto);
        }
    }
}
