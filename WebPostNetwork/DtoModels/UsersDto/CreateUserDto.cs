using System.ComponentModel.DataAnnotations;

namespace WebPostNetwork.DtoModels.UsersDto;

public class CreateUserDto
{
    [Required]
    public string Username { get; set; } = null!;
    [Required]
    public string Email { get; set; } = null!;
    [Required]
    public string PasswordHash { get; set; } = null!;
}
