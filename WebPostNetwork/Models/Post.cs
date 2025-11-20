namespace WebPostNetwork.Models;

public class Post
{
    //ID поста
    public int Id { get; set; }

    //Содержание поста
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    //Пользователь
    public int UserId { get; set; }
    public User User { get; set; }

    // Навигации
    public List<Comment> Comments { get; set; } = new();
    public List<Like> Likes { get; set; } = new();
    public List<MediaFile> MediaFiles { get; set; } = new();
}
