using Microsoft.AspNetCore.Mvc.Rendering;

namespace qr2.Helpers
{
    public static class HtmlHelpers
    {
        public static string IsActive(this IHtmlHelper html,
                                      string controller,
                                      string action = null,
                                      string cssClass = "active")
        {
            var routeData = html.ViewContext.RouteData;
            var currentController = routeData.Values["controller"]?.ToString();
            var currentAction = routeData.Values["action"]?.ToString();

            bool controllerMatch = string.Equals(currentController, controller, StringComparison.OrdinalIgnoreCase);
            bool actionMatch = action == null || string.Equals(currentAction, action, StringComparison.OrdinalIgnoreCase);

            return controllerMatch && actionMatch ? cssClass : "";
        }
    }
}
