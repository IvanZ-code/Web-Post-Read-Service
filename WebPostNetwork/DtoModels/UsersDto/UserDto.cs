namespace WebPostNetwork.DtoModels.UsersDto;

public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

   
    public string? FullName { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }

    public UserDto(Models.User user)
    {
        Id = user.Id;
        Username = user.Username;
        Email = user.Email;
        CreatedAt = user.CreatedAt;
        FullName = user.Profile?.FullName;
        Bio = user.Profile?.Bio;
        AvatarUrl = user.Profile?.AvatarUrl;
    }
}
