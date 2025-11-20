using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebPostNetwork.Data;
using WebPostNetwork.DtoModels.PostsDto;
using WebPostNetwork.Models;

namespace WebPostNetwork.Controllers;
[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly DataContext _context;

    public PostsController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PostDto>>> GetPosts([FromQuery] int? userId)
    {
        IQueryable<Post> query = _context.Posts.Include(p => p.User);

        if (userId.HasValue)
        {
            query = query.Where(p => p.UserId == userId.Value);
        }

        var posts = await query
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostDto
            {
                Id = p.Id,
                Content = p.Content,
                CreatedAt = p.CreatedAt,
                UserId = p.UserId,
                Username = p.User.Username
            })
            .ToListAsync();

        return Ok(posts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PostDto>> GetPost(int id)
    {
        var post = await _context.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == id);

        if(post == null)
        {
            return NotFound();
        }
        var resultDto = new PostDto
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UserId = post.UserId,
            Username = post.User.Username
        };

        return resultDto;
    }

    [HttpPost]
    public async Task<ActionResult<PostDto>> CreatePost(CreatePostDto dto)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
        if (!userExists)
            return BadRequest($"User with Id={dto.UserId} does not exist.");

        var post = new Post
        {
            Content = dto.Content,
            UserId = dto.UserId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        var resultDto = new PostDto
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UserId = post.UserId,
            Username = (await _context.Users.FindAsync(post.UserId)).Username
        };

        return CreatedAtAction(nameof(GetPost), new { id = post.Id }, resultDto);
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> UpdatePost(int id, UpdatePostDto dto)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null)
            return NotFound();

        if (!string.IsNullOrEmpty(dto.Content))
            post.Content = dto.Content;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return NotFound();

        _context.Posts.Remove(post);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
    