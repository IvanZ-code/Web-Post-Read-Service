namespace WebPostNetwork.Models;

public class Role
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;  // "Admin", "User", "Moderator" и т.д.

    // Навигация: пользователи с этой ролью
    public List<UserRole> UserRoles { get; set; } = new();
}
