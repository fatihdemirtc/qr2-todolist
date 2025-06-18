using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using qr2.Data;
using qr2.Models;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

// Connection string al
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// DbContext ekle
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Identity servisini ekle (UI dahil)
builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
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

var app = builder.Build();

// Middleware pipeline

var supportedCultures = new[] { "en", "tr", "de", "fr", "es" };

var localizationOptions = new RequestLocalizationOptions
{
    DefaultRequestCulture = new RequestCulture("en"), 
    SupportedCultures = supportedCultures.Select(c => new CultureInfo(c)).ToList(),
    SupportedUICultures = supportedCultures.Select(c => new CultureInfo(c)).ToList()
};

// Accept-Language header otomatik olarak sýrada en son gelir
// Eðer QueryString veya Cookie ile override istemiyorsan sadece AcceptLanguage yeterli
localizationOptions.RequestCultureProviders = new List<IRequestCultureProvider>
{
     new CookieRequestCultureProvider(),
    new AcceptLanguageHeaderRequestCultureProvider(),
    
};

app.UseRequestLocalization(localizationOptions);

app.UseStaticFiles();
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

app.Run();
