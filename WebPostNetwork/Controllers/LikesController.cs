using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebPostNetwork.Data;
using WebPostNetwork.DtoModels.LikesDto;
using WebPostNetwork.Models;

namespace WebPostNetwork.Controllers;

[ApiController]
[Route("api/[controller]")]

public class LikesController : ControllerBase
{
    private readonly DataContext _context;

    public LikesController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetLikes([FromQuery] int postId, [FromQuery] int? userId)
    {
        if (postId <= 0) return BadRequest("postId is required");

        var count = await _context.Likes.CountAsync(l => l.PostId == postId);

        if (userId.HasValue)
        {
            var isLiked = await _context.Likes.AnyAsync(l => l.PostId == postId && l.UserId == userId.Value);
            return Ok(new { count, isLiked });
        }

        return Ok(new { count, isLiked = false });
    }

    [HttpPost]
    public async Task<IActionResult> AddLike([FromBody] LikeDto dto)
    {
        if (dto == null || dto.PostId <= 0 || dto.UserId <= 0)
            return BadRequest("postId and userId are required");

        var postExists = await _context.Posts.AnyAsync(p => p.Id == dto.PostId);
        if (!postExists) return NotFound($"Post {dto.PostId} not found");

        var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
        if (!userExists) return NotFound($"User {dto.UserId} not found");

        // Если лайк уже есть — не добавляем второй
        var existing = await _context.Likes.FirstOrDefaultAsync(l => l.PostId == dto.PostId && l.UserId == dto.UserId);
        if (existing != null)
        {
            return Ok(new { message = "Already liked", id = existing.Id });
        }

        var like = new Like
        {
            PostId = dto.PostId,
            UserId = dto.UserId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Likes.Add(like);
        await _context.SaveChangesAsync();

        var count = await _context.Likes.CountAsync(l => l.PostId == dto.PostId);
        return CreatedAtAction(nameof(GetLikes), new { postId = dto.PostId, userId = dto.UserId }, new { id = like.Id, count, isLiked = true });
    }

    [HttpDelete]
    public async Task<IActionResult> RemoveLike([FromBody] LikeDto dto)
    {
        if (dto == null || dto.PostId <= 0 || dto.UserId <= 0)
            return BadRequest("postId and userId are required");

        var existing = await _context.Likes.FirstOrDefaultAsync(l => l.PostId == dto.PostId && l.UserId == dto.UserId);
        if (existing == null)
        {
            return NotFound("Like not found");
        }

        _context.Likes.Remove(existing);
        await _context.SaveChangesAsync();

        var count = await _context.Likes.CountAsync(l => l.PostId == dto.PostId);
        return Ok(new { message = "Removed", count, isLiked = false });
    }

}
