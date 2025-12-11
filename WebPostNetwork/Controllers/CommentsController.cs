using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using WebPostNetwork.Data;
using WebPostNetwork.DtoModels.CommentsDto;
using WebPostNetwork.Models;

namespace WebPostNetwork.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly DataContext _context;

    public CommentsController(DataContext context)
    {
        _context = context;
    }

    // GET api/comments?postId=5
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(int postId)
    {
        var comments = await _context.Comments
            .Include(c => c.User)
            .Where(c => c.PostId == postId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                Username = c.User.Username,
                UserId = c.UserId,
                PostId = c.PostId
            })
            .ToListAsync();

        return Ok(comments);
    }

    // POST api/comments
    [HttpPost]
    public async Task<ActionResult<CommentDto>> CreateComment(CreateCommentDto dto)
    {
        var user = await _context.Users.FindAsync(dto.UserId);
        if (user == null)
            return BadRequest("User not found");

        var post = await _context.Posts.FindAsync(dto.PostId);
        if (post == null)
            return BadRequest("Post not found");

        var comment = new Comment
        {
            Content = dto.Content,
            UserId = dto.UserId,
            PostId = dto.PostId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        var response = new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            Username = user.Username,
            UserId = comment.UserId,
            PostId = comment.PostId
        };

        return Ok(response);
    }
    [HttpDelete]
    public async Task<IActionResult> DeleteComment([FromBody] DeleteCommentDto dto)
    {

        var comment = await _context.Comments
            .Include(c => c.Post)
            .FirstOrDefaultAsync(c => c.Id == dto.Id);

        if (comment == null)
            return NotFound("Comment not found");

        if (comment.UserId != dto.UserId && comment.Post.UserId != dto.UserId)
            return Forbid("Not allowed to delete this comment");

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

