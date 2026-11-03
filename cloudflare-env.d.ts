declare namespace Cloudflare {
  interface Env {
    EXTERNAL_D1_URL?: string;
    EXTERNAL_D1_SECRET?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
