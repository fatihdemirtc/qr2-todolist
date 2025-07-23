using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using qr2.Data;
using qr2.Middlewares;
using qr2.Models;
using qr2.Services;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

// Connection string al
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

Console.WriteLine("🔍 Final ConnectionString: " + connectionString); // EKLE BUNU


// DbContext ekle
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Identity servisini ekle (UI dahil)
builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
     .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultUI();

// Google login
builder.Services.AddAuthentication()
    .AddGoogle(googleOptions =>
    {
        googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
        googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    });

// MVC ve Razor Pages
builder.Services.AddControllersWithViews()
    .AddViewLocalization()
    .AddDataAnnotationsLocalization();

builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

builder.Services.AddRazorPages();

builder.Services.AddHttpClient();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear(); // 🔥 GCP / LoadBalancer güvenli sayılmıyor olabilir
    options.KnownProxies.Clear();
});

var app = builder.Build();
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedFor | Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedProto
});
app.UseMiddleware<ExceptionLoggingMiddleware>();
// Middleware pipeline

var supportedCultures = new[] { "en", "tr", "de", "fr", "es" };

var localizationOptions = new RequestLocalizationOptions
{
    DefaultRequestCulture = new RequestCulture("en"), 
    SupportedCultures = supportedCultures.Select(c => new CultureInfo(c)).ToList(),
    SupportedUICultures = supportedCultures.Select(c => new CultureInfo(c)).ToList()
};

// Accept-Language header otomatik olarak sırada en son gelir
// Eğer QueryString veya Cookie ile override istemiyorsan sadece AcceptLanguage yeterli
localizationOptions.RequestCultureProviders = new List<IRequestCultureProvider>
{
     new CookieRequestCultureProvider(),
    new AcceptLanguageHeaderRequestCultureProvider(),
    
};



app.UseRequestLocalization(localizationOptions);
app.UseStatusCodePages(context =>
{
    if (context.HttpContext.Response.StatusCode == 404 || context.HttpContext.Response.StatusCode == 403)
    {
        context.HttpContext.Response.Redirect("/");
    }
    return Task.CompletedTask;
});
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Route mapping
app.MapDefaultControllerRoute();
app.MapRazorPages();



// Migration
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await IdentitySeeder.SeedRolesAndAdminAsync(services);
}

app.Run();
