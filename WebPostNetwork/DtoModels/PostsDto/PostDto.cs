namespace WebPostNetwork.DtoModels.PostsDto;

public class PostDto
{
    public int Id { get; set; }
    public string Content { get; set; } = null!;
    public DateTime CreatedAt { get; set; }


    public int UserId { get; set; }
    public string Username { get; set; } = null!;
}
