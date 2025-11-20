namespace WebPostNetwork.Models;

public class User
{
    //ID пользователя
    public int Id { get; set; }

    //Данные пользователя
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    //Новигация
    public Profile Profile { get; set; }
    public List<Post> Posts { get; set; } = new();
    public List<Comment> Comments { get; set; } = new();
    public List<Like> Likes { get; set; } = new();
    public List<Follow> Followers { get; set; } = new();   
    public List<Follow> Following { get; set; } = new();   
    public List<Notification> Notifications { get; set; } = new();
    public List<UserRole> UserRoles { get; set; } = new();
}

