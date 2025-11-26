using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebPostNetwork.Data;
using WebPostNetwork.DtoModels.ProfilesDto;
using WebPostNetwork.Models;

namespace WebPostNetwork.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfilesController : ControllerBase
{
    private readonly DataContext _context;

    public ProfilesController(DataContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetProfile(int userId)
    {
        var profile = await _context.Profiles
        .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            return NotFound();

        var dto = new ProfileDto(profile);

        return Ok(dto);
    }

    [HttpPut("{userId}")]
    public async Task<IActionResult> UpdateProfile(int userId, UpdateProfileDto dto)
    {
        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            return NotFound();

        if (!string.IsNullOrWhiteSpace(dto.FullName))
            profile.FullName = dto.FullName;

        if (!string.IsNullOrWhiteSpace(dto.Bio))
            profile.Bio = dto.Bio;

        if (!string.IsNullOrWhiteSpace(dto.AvatarUrl))
            profile.AvatarUrl = dto.AvatarUrl;

        await _context.SaveChangesAsync();

        return Ok(new ProfileDto(profile));
    }
}
