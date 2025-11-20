namespace WebPostNetwork.Models;

public class MediaFile
{
    public int Id { get; set; }

    public string Url { get; set; } = string.Empty;       // Ссылка на файл
    public string FileType { get; set; } = string.Empty;  // "image/png", "video/mp4" и т.д.
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public int PostId { get; set; }
    public Post Post { get; set; }
}
