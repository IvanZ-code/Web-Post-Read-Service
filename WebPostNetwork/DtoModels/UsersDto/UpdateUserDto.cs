namespace WebPostNetwork.DtoModels.UsersDto;

public class UpdateUserDto
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }
}
