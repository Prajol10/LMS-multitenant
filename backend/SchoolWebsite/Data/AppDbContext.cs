using Microsoft.EntityFrameworkCore;
using SchoolWebsite.Models;
namespace SchoolWebsite.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<Notice> Notices { get; set; }
        public DbSet<GalleryImage> GalleryImages { get; set; }
        public DbSet<AdminUser> AdminUsers { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<SchoolProgram> SchoolPrograms { get; set; }
        public DbSet<Student> Students { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Tenant>().HasIndex(t => t.Subdomain).IsUnique();
            modelBuilder.Entity<Notice>().HasOne(n => n.Tenant).WithMany().HasForeignKey(n => n.TenantId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<GalleryImage>().HasOne(g => g.Tenant).WithMany().HasForeignKey(g => g.TenantId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<AdminUser>().HasIndex(a => a.Email).IsUnique();
            modelBuilder.Entity<AdminUser>().HasOne(a => a.Tenant).WithMany().HasForeignKey(a => a.TenantId).OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<ContactMessage>().HasOne(m => m.Tenant).WithMany().HasForeignKey(m => m.TenantId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<SchoolProgram>().HasOne(p => p.Tenant).WithMany().HasForeignKey(p => p.TenantId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Student>().HasOne(s => s.Tenant).WithMany().HasForeignKey(s => s.TenantId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
