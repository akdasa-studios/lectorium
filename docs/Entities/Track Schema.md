# Entities :: Track Schema

```json
{
  "_id": "{track_id}::track",
  "@type": "track",
  "version": 1,
  "location": "mayapur",
  "date": [1974, 10, 20],
  "author": "acbsp",
  "title": {
    "ru": "Title in Russian",
    "en": "Title in English",
  },
  "references": [
    ["sb", 1, 8, 40]
  ],
  "audio": {
    "original": {
      "path": "library/tracks/{track_id}/audio/original.mp3",
      "file_size": 12345,
      "duration": 12345,
    }
  },
  "languages": [
    {
      "language": "ru",
      "source": "track",
      "type": "original"
    },
    {
      "language": "ru",
      "source": "transcript",
      "type": "generated"
    }
  ],
}
```

## Version History
**Version 1**: Initial schema with support for multilingual titles, basic metadata, references, and language details.