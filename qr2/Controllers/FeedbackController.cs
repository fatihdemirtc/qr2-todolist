using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using Microsoft.EntityFrameworkCore;
using qr2.Data;
using qr2.Models;
using qr2.ViewModel;

[Authorize(Roles = "user")]
public class FeedbackController : Controller
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public FeedbackController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IActionResult> Index()
    {
        ViewBag.PageTitle = "Feedback";
        return View();
    }

    public async Task<IActionResult> GetFeedbacks()
    {
        var userId = _userManager.GetUserId(User);
        var feedbacks = await _context.Feedbacks
        .Where(f => f.UserId == userId)
        .OrderByDescending(f => f.SubmittedAt)
        .Select(f => new {
            content = f.Message,
            date = f.SubmittedAt.ToLocalTime().ToString("MMM dd, yyyy HH:mm")
        })
        .ToListAsync();

        return Json(feedbacks);
    }

    [HttpPost]
    public async Task<IActionResult> Submit(FeedbackViewModel model)
    {
        if (!ModelState.IsValid) return Json(new { success = false, error = "Please fill in the blanks correctly"});

        var user = await _userManager.GetUserAsync(User);
        var feedback = new Feedback
        {
            UserId = user.Id,
            Message = model.Message,
            SubmittedAt = DateTime.UtcNow
        };

        _context.Feedbacks.Add(feedback);
        await _context.SaveChangesAsync();

        return Json(new { success = true , message= "Thank you for your feedback! Your message has been submitted successfully." });
    }
}
