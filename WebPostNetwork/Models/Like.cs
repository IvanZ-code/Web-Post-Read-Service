namespace WebPostNetwork.Models;

public class Like
{
    //ID лайка
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    //Пользователь
    public int UserId { get; set; }
    public User User { get; set; }

    //Пост
    public int PostId { get; set; }
    public Post Post { get; set; }
}
