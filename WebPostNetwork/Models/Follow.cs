namespace WebPostNetwork.Models;

public class Follow
{
    //Подписка
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    //Кто подписался
    public int FollowerId { get; set; }
    public User Follower { get; set; }

    //На кого подписался
    public int FollowingId { get; set; }
    public User Following { get; set; }
}
