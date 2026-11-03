// Server-side sharing for the verified spouse account, authorized by the data owner.
export const SHARED_RECORD_OWNER='qDJYvRQx9ZKHuVRqRh8ZHR2HuzEQU8rPZKjpmp6XvHIr7bQfNXjZu6';
export function recordOwner(headers:Headers):string|null {
 const userId=headers.get('oai-authenticated-user-id');
 if(!userId)return null;
 const email=headers.get('oai-authenticated-user-email')?.trim().toLowerCase();
 return email==='draraisapaixao@gmail.com'?SHARED_RECORD_OWNER:userId;
}
