using Microsoft.EntityFrameworkCore;
using SchoolWebsite.Data;

namespace SchoolWebsite.Middleware
{
    public class TenantMiddleware
    {
        private readonly RequestDelegate _next;

        public TenantMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
        {
            // Extract tenant from query parameter first, then subdomain
            var tenantIdentifier = GetTenantIdentifier(context);

            // If tenant identifier exists, try to find the tenant
            if (!string.IsNullOrEmpty(tenantIdentifier))
            {
                var tenant = await dbContext.Tenants
                    .FirstOrDefaultAsync(t => 
                        (t.Subdomain.ToLower() == tenantIdentifier.ToLower() || 
                         t.Id.ToString() == tenantIdentifier) && 
                        t.IsActive);

                if (tenant != null)
                {
                    // Add tenant info to HttpContext items
                    context.Items["TenantId"] = tenant.Id;
                    context.Items["Tenant"] = tenant;
                }
            }

            await _next(context);
        }

        private string GetTenantIdentifier(HttpContext context)
        {
            // First check query parameter
            if (context.Request.Query.ContainsKey("school"))
            {
                return context.Request.Query["school"].ToString();
            }

            // Then check subdomain
            var host = context.Request.Host.Host;
            var subdomain = GetSubdomain(host);
            
            if (!string.IsNullOrEmpty(subdomain))
            {
                return subdomain;
            }

            return string.Empty;
        }

        private string GetSubdomain(string host)
        {
            // Assuming the main domain is edunepal.com
            // You might need to adjust this based on your actual domain
            if (host.EndsWith(".edunepal.com"))
            {
                return host.Replace(".edunepal.com", "");
            }
            
            // For localhost testing
            if (host.EndsWith(".localhost"))
            {
                return host.Replace(".localhost", "");
            }

            return string.Empty;
        }
    }
}
