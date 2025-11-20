using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using WebPostNetwork.Data;
using WebPostNetwork.DtoModels.UsersDto;
using WebPostNetwork.Models;
using System.Text;

namespace WebPostNetwork.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly DataContext _context;


    public UsersController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers([FromQuery] string? search)
    {
        try
        {
          
            var query = _context.Users
                .Include(u => u.Profile)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                string loweredSearch = search.ToLower();
                query = query.Where(u => u.Username != null && u.Username.ToLower().StartsWith(loweredSearch));
            }

            var users = await query.ToListAsync();

            var result = users.Select(u => new UserDto(u));

            return Ok(result);
        }
        catch (Exception ex)
        {
            
            Console.WriteLine(ex);

           
            return StatusCode(500, $"Internal Server Error: {ex.Message}");
        }
    }



    [HttpGet("byid/{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _context.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound();

        var resultDto = new UserDto(user);

        return resultDto;
    }


    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
            return BadRequest("Username уже занят");

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.PasswordHash);

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var resultDto = new UserDto(user);

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, resultDto);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        if (!string.IsNullOrEmpty(dto.Username))
            user.Username = dto.Username;
        if (!string.IsNullOrEmpty(dto.Email))
            user.Email = dto.Email;
        if (!string.IsNullOrEmpty(dto.PasswordHash))
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.PasswordHash);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == dto.Username);

        if (user == null)
            return BadRequest("User not found");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return BadRequest("Invalid password");

        return new UserDto(user);
    }
}

