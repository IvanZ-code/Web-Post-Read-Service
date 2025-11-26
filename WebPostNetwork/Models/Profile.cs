namespace WebPostNetwork.Models;

public class Profile
{
    //ID профиля
    public int Id { get; set; }

    //Пользователь
    public int UserId { get; set; }
    public User User { get; set; }
        
    //Описание
    public string FullName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
}

