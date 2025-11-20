namespace WebPostNetwork.Models;

public class Notification
{
    //ID уведомления
    public int Id { get; set; }

    //Параметры уведомления
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    //Пользователь
    public int UserId { get; set; }
    public User User { get; set; }
}
