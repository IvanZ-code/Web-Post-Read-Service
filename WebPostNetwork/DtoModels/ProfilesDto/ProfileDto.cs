using WebPostNetwork.Models;

namespace WebPostNetwork.DtoModels.ProfilesDto;

public class ProfileDto
{
    public string FullName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;

    public ProfileDto(Profile profile)
    {
        FullName = profile.FullName;
        Bio = profile.Bio;
        AvatarUrl = profile.AvatarUrl;
    }
}
