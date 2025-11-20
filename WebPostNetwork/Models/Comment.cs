namespace WebPostNetwork.Models;

public class Comment
{
    //ID комментария
    public int Id { get; set; }

    //Параметры комментария
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    //Пользователь
    public int UserId { get; set; }
    public User User { get; set; }

    //Параметр поста
    public int PostId { get; set; }
    public Post Post { get; set; }
}
