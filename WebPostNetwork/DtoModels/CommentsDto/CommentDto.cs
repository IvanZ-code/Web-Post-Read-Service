namespace WebPostNetwork.DtoModels.CommentsDto;

public class CommentDto
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string Username { get; set; } = string.Empty;
    public int UserId { get; set; }
    public int PostId { get; set; }
}
