# Logs Directory

This directory contains application logs for debugging and monitoring purposes.

## Log Files

| File | Description |
|------|-------------|
| `app.log` | General application logs |
| `api.log` | API request/response logs |
| `error.log` | Error logs for debugging |
| `analytics.log` | Analytics tracking events |

## Log Format

Each log entry follows this format:
```
[TIMESTAMP] [LEVEL] [MODULE] Message
```

Example:
```
[2026-02-05T13:30:00.000Z] [INFO] [API] POST /api/admin/forms - 201 Created
[2026-02-05T13:30:01.000Z] [ERROR] [Survey] Failed to submit to webhook: Connection timeout
```

## Log Levels

- `DEBUG` - Detailed debugging information
- `INFO` - General informational messages
- `WARN` - Warning messages (non-critical issues)
- `ERROR` - Error messages (requires attention)
- `FATAL` - Critical errors (app may crash)

## Accessing Logs

In development:
```bash
# View real-time logs
tail -f logs/app.log

# Search for errors
grep "ERROR" logs/error.log
```

## Log Rotation

Logs are rotated daily. Old logs are compressed and stored for 30 days.

## Important Notes

1. **Do not commit log files** - They are excluded in `.gitignore`
2. **Sensitive data** - Never log passwords, tokens, or PII
3. **Production** - Use proper log management (e.g., LogDNA, Datadog)
