using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using Microsoft.EntityFrameworkCore;
using qr2.Data;
using qr2.Models;
using qr2.ViewModel;

[Authorize]
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
        return View();
    }

    public async Task<IActionResult> GetFeedbacks()
    {
        var userId = _userManager.GetUserId(User);
        var feedbacks = _context.Feedbacks.AsNoTracking().Where(x => x.UserId == userId);

        return Json(new { success = true });
    }

    [HttpPost]
    public async Task<IActionResult> Submit(FeedbackViewModel model)
    {
        if (!ModelState.IsValid) return Json(new { success = false, error = "ModelState" });

        var user = await _userManager.GetUserAsync(User);
        var feedback = new Feedback
        {
            UserId = user.Id,
            Message = model.Message,
            SubmittedAt = DateTime.UtcNow
        };

        _context.Feedbacks.Add(feedback);
        await _context.SaveChangesAsync();

        return Json(new { success = true });
    }
}
