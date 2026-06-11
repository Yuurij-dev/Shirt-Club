export type AuthenticatedUser = {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
};

type SupabaseUserResponse = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
};

const getSupabaseUrl = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
};

const getSupabaseApiKey = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ""
  );
};

export const getBearerToken = (request: Request) => {
  const authorization = request.headers.get("authorization") || "";

  if (!authorization.toLowerCase().startsWith("bearer ")) return null;

  return authorization.slice(7).trim();
};

export const getAuthenticatedUser = async (
  request: Request
): Promise<AuthenticatedUser | null> => {
  const token = getBearerToken(request);
  const supabaseUrl = getSupabaseUrl();
  const apiKey = getSupabaseApiKey();

  if (!token || !supabaseUrl || !apiKey) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const user = (await response.json()) as SupabaseUserResponse;

  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.user_metadata?.name,
    avatarUrl: user.user_metadata?.avatar_url,
  };
};
